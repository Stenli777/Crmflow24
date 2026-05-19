import type { Editor } from "@tiptap/react";
import { restoreEditorSelection } from "./selectionStorage";

export type ArticleHeadingLevel = 2 | 3;

/**
 * Применяет H2/H3 только к блокам, попадающим в выделение.
 * При частичном выделении внутри абзаца сначала разбивает блок (split).
 */
export function applyHeadingToSelection(
  editor: Editor,
  level: ArticleHeadingLevel,
): boolean {
  restoreEditorSelection(editor);

  const { empty, from, to } = editor.state.selection;

  if (empty) {
    return editor.chain().focus().toggleHeading({ level }).run();
  }

  const splitThenHeading = editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const { schema } = state;
      const heading = schema.nodes.heading;
      const paragraph = schema.nodes.paragraph;
      if (!heading || !paragraph) {
        return false;
      }

      let selFrom = from;
      let selTo = to;

      const splitAt = (pos: number) => {
        const $pos = tr.doc.resolve(pos);
        if (!$pos.parent.isTextblock) {
          return;
        }
        if ($pos.parentOffset <= 0 || $pos.parentOffset >= $pos.parent.content.size) {
          return;
        }
        tr = tr.split(pos, 1);
        selFrom = tr.mapping.map(selFrom);
        selTo = tr.mapping.map(selTo);
      };

      splitAt(selTo);
      splitAt(selFrom);

      const blocks = new Set<number>();
      tr.doc.nodesBetween(selFrom, selTo, (node, pos) => {
        if (!node.isTextblock) {
          return;
        }
        const $pos = tr.doc.resolve(pos);
        if ($pos.depth < 1) {
          return;
        }
        blocks.add(pos);
      });

      if (blocks.size === 0) {
        return false;
      }

      blocks.forEach((pos) => {
        const node = tr.doc.nodeAt(pos);
        if (!node?.isTextblock) {
          return;
        }
        if (node.type === heading && node.attrs.level === level) {
          tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
        } else {
          tr.setNodeMarkup(pos, heading, { ...node.attrs, level }, node.marks);
        }
      });

      return true;
    })
    .run();

  if (splitThenHeading) {
    return true;
  }

  return editor.chain().focus().toggleHeading({ level }).run();
}
