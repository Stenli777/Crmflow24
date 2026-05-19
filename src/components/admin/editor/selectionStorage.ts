import type { Editor } from "@tiptap/react";

export type SavedSelection = { from: number; to: number };

let lastSelection: SavedSelection | null = null;

/** Сохраняет последнее выделение редактора (для восстановления после клика по toolbar). */
export function rememberEditorSelection(editor: Editor): void {
  const { from, to } = editor.state.selection;
  lastSelection = { from, to };
}

export function clearRememberedSelection(): void {
  lastSelection = null;
}

/** Восстанавливает выделение, если оно сброшено (например, после focus на кнопке). */
export function restoreEditorSelection(editor: Editor): boolean {
  if (!lastSelection) {
    return false;
  }

  const docSize = editor.state.doc.content.size;
  const from = Math.min(lastSelection.from, docSize);
  const to = Math.min(lastSelection.to, docSize);

  if (from < 0 || to < 0) {
    return false;
  }

  const current = editor.state.selection;
  if (current.from === from && current.to === to) {
    return true;
  }

  return editor.chain().focus().setTextSelection({ from, to }).run();
}

export function bindEditorSelectionStorage(editor: Editor): () => void {
  const handler = () => rememberEditorSelection(editor);
  editor.on("selectionUpdate", handler);
  editor.on("focus", handler);
  return () => {
    editor.off("selectionUpdate", handler);
    editor.off("focus", handler);
  };
}

/** Не даёт кнопке toolbar забрать focus у contenteditable. */
export function preventToolbarFocusLoss(
  handler: (event: React.MouseEvent) => void,
): (event: React.MouseEvent) => void {
  return (event) => {
    event.preventDefault();
    handler(event);
  };
}
