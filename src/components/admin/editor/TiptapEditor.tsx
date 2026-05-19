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
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Alert, Box, Typography } from "@mui/material";
import { sanitizePostHtml } from "@/lib/admin/posts/sanitize";
import type { TiptapEditorProps } from "./editorTypes";
import { EditorToolbar, type EditorViewMode } from "./EditorToolbar";
import { HtmlSourceEditor } from "./HtmlSourceEditor";
import { bindEditorSelectionStorage } from "./selectionStorage";

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
    return sanitizePostHtml(initialContentHtml);
  }
  return { type: "doc", content: [{ type: "paragraph" }] };
}

function formatHtmlForEditor(html: string): string {
  return sanitizePostHtml(html);
}

export const TiptapEditor = forwardRef<TiptapEditorHandle, TiptapEditorProps>(
  function TiptapEditor({ initialContentJson, initialContentHtml }, ref) {
    const jsonRef = useRef<HTMLInputElement>(null);
    const htmlRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<EditorViewMode>("visual");
    const [htmlDraft, setHtmlDraft] = useState("");
    const [htmlError, setHtmlError] = useState<string | null>(null);
    const htmlDraftRef = useRef(htmlDraft);
    htmlDraftRef.current = htmlDraft;
    const viewModeRef = useRef<EditorViewMode>(viewMode);
    viewModeRef.current = viewMode;

    const writeHiddenFields = useCallback(
      (json: JSONContent, html: string) => {
        const jsonStr = JSON.stringify(json);
        const safeHtml = formatHtmlForEditor(html);
        if (jsonRef.current) jsonRef.current.value = jsonStr;
        if (htmlRef.current) htmlRef.current.value = safeHtml;
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
        Table.configure({ resizable: false }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: resolveInitialContent(initialContentJson, initialContentHtml),
      editorProps: {
        transformPastedHTML(html) {
          return sanitizePostHtml(html);
        },
      },
      onUpdate: ({ editor: ed }) => {
        if (viewModeRef.current === "visual") {
          writeHiddenFields(ed.getJSON(), ed.getHTML());
        }
      },
    });

    useEffect(() => {
      if (!editor) return;
      return bindEditorSelectionStorage(editor);
    }, [editor]);

    const applyHtmlToEditor = useCallback(
      (rawHtml: string): boolean => {
        if (!editor) return false;

        const sanitized = formatHtmlForEditor(rawHtml);
        if (!sanitized && rawHtml.trim().length > 0) {
          setHtmlError("После санитизации не осталось допустимой разметки.");
          return false;
        }

        try {
          const ok = editor.commands.setContent(
            sanitized || "<p></p>",
            { emitUpdate: false },
          );
          if (!ok) {
            setHtmlError("Не удалось применить HTML к редактору.");
            return false;
          }
          writeHiddenFields(editor.getJSON(), editor.getHTML());
          setHtmlError(null);
          return true;
        } catch {
          setHtmlError("Некорректная HTML-разметка. Проверьте закрытие тегов.");
          return false;
        }
      },
      [editor, writeHiddenFields],
    );

    const syncToFormFields = useCallback(() => {
      if (!editor) return;

      if (viewMode === "html") {
        applyHtmlToEditor(htmlDraftRef.current);
        return;
      }

      writeHiddenFields(editor.getJSON(), editor.getHTML());
    }, [editor, viewMode, writeHiddenFields, applyHtmlToEditor]);

    useImperativeHandle(ref, () => ({ syncToFormFields }), [syncToFormFields]);

    useEffect(() => {
      if (editor && viewMode === "visual") {
        writeHiddenFields(editor.getJSON(), editor.getHTML());
      }
    }, [editor, viewMode, writeHiddenFields]);

    const handleViewModeChange = (mode: EditorViewMode) => {
      if (mode === viewMode) return;

      if (mode === "html") {
        if (editor) {
          const current = formatHtmlForEditor(editor.getHTML());
          setHtmlDraft(current);
          writeHiddenFields(editor.getJSON(), current);
        }
        setHtmlError(null);
        setViewMode("html");
        return;
      }

      const applied = applyHtmlToEditor(htmlDraftRef.current);
      if (!applied) {
        return;
      }
      setViewMode("visual");
    };

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

    const handleHtmlDraftChange = (next: string) => {
      setHtmlDraft(next);
      setHtmlError(null);
      if (htmlRef.current) {
        htmlRef.current.value = next;
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
        {htmlError && viewMode === "html" ? (
          <Alert severity="warning" sx={{ mb: 1 }}>
            {htmlError}
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
              "& table": {
                borderCollapse: "collapse",
                width: "100%",
                my: 2,
              },
              "& th, & td": {
                border: 1,
                borderColor: "divider",
                p: 1,
                verticalAlign: "top",
              },
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
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
          {viewMode === "visual" ? (
            <EditorContent editor={editor} />
          ) : (
            <HtmlSourceEditor
              value={htmlDraft}
              onChange={handleHtmlDraftChange}
              error={htmlError}
            />
          )}
        </Box>
        <input ref={jsonRef} type="hidden" name="contentJson" defaultValue="" />
        <input ref={htmlRef} type="hidden" name="contentHtml" defaultValue="" />
      </Box>
    );
  },
);
