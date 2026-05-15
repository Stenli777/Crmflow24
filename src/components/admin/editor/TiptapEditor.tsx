"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Alert, Box, Typography } from "@mui/material";
import type { TiptapEditorProps } from "./editorTypes";
import { EditorToolbar } from "./EditorToolbar";

export type TiptapEditorHandle = {
  syncToFormFields: () => void;
};

function resolveInitialContent(
  initialContentJson?: unknown | null,
  initialContentHtml?: string | null,
): JSONContent | string {
  if (
    initialContentJson &&
    typeof initialContentJson === "object" &&
    !Array.isArray(initialContentJson)
  ) {
    return initialContentJson as JSONContent;
  }
  if (initialContentHtml?.trim()) {
    return initialContentHtml;
  }
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export const TiptapEditor = forwardRef<TiptapEditorHandle, TiptapEditorProps>(
  function TiptapEditor({ initialContentJson, initialContentHtml }, ref) {
    const jsonRef = useRef<HTMLInputElement>(null);
    const htmlRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const writeHiddenFields = useCallback(
      (json: JSONContent, html: string) => {
        const jsonStr = JSON.stringify(json);
        if (jsonRef.current) jsonRef.current.value = jsonStr;
        if (htmlRef.current) htmlRef.current.value = html;
      },
      [],
    );

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            rel: "nofollow noopener noreferrer",
            target: "_blank",
          },
        }),
        Image.configure({ inline: false, allowBase64: false }),
        Placeholder.configure({ placeholder: "Напишите текст статьи..." }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      content: resolveInitialContent(initialContentJson, initialContentHtml),
      onUpdate: ({ editor: ed }) => {
        writeHiddenFields(ed.getJSON(), ed.getHTML());
      },
    });

    const syncToFormFields = useCallback(() => {
      if (!editor) return;
      writeHiddenFields(editor.getJSON(), editor.getHTML());
    }, [editor, writeHiddenFields]);

    useImperativeHandle(ref, () => ({ syncToFormFields }), [syncToFormFields]);

    useEffect(() => {
      if (editor) {
        writeHiddenFields(editor.getJSON(), editor.getHTML());
      }
    }, [editor, writeHiddenFields]);

    const handleImageUpload = async (file: File) => {
      setUploadError(null);
      setUploading(true);
      try {
        const body = new FormData();
        body.append("file", file);

        const res = await fetch("/api/admin/media/upload", {
          method: "POST",
          body,
        });

        const data = (await res.json()) as {
          url?: string;
          error?: string;
        };

        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Не удалось загрузить изображение");
        }

        const alt =
          window.prompt("Alt-текст изображения (для доступности)", "") ?? "";

        editor
          ?.chain()
          .focus()
          .setImage({ src: data.url, alt: alt || undefined })
          .run();

        syncToFormFields();
      } catch (e) {
        setUploadError(
          e instanceof Error ? e.message : "Не удалось загрузить изображение",
        );
      } finally {
        setUploading(false);
      }
    };

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          HTML-контент статьи
        </Typography>
        {uploadError ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {uploadError}
          </Alert>
        ) : null}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "background.paper",
            "& .ProseMirror": {
              minHeight: 280,
              p: 2,
              outline: "none",
              "& p": { my: 1 },
              "& h2, & h3, & h4": { mt: 2, mb: 1 },
              "& ul, & ol": { pl: 3 },
              "& img": { maxWidth: "100%", height: "auto", borderRadius: 1 },
              "& blockquote": {
                borderLeft: 3,
                borderColor: "divider",
                pl: 2,
                color: "text.secondary",
              },
            },
            "& .ProseMirror p.is-editor-empty:first-of-type::before": {
              color: "text.disabled",
              content: "attr(data-placeholder)",
              float: "left",
              height: 0,
              pointerEvents: "none",
            },
          }}
        >
          <EditorToolbar
            editor={editor}
            onImageUpload={handleImageUpload}
            uploading={uploading}
          />
          <EditorContent editor={editor} />
        </Box>
        <input ref={jsonRef} type="hidden" name="contentJson" defaultValue="" />
        <input ref={htmlRef} type="hidden" name="contentHtml" defaultValue="" />
      </Box>
    );
  },
);
