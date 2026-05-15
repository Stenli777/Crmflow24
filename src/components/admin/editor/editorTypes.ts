import type { JSONContent } from "@tiptap/react";

export type EditorContentValue = {
  json: JSONContent;
  html: string;
};

export type TiptapEditorProps = {
  initialContentJson?: unknown | null;
  initialContentHtml?: string | null;
};
