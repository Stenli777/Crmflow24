"use client";

import { useRef } from "react";
import type { Editor } from "@tiptap/react";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";

type EditorToolbarProps = {
  editor: Editor | null;
  onImageUpload: (file: File) => Promise<void>;
  uploading: boolean;
};

export function EditorToolbar({
  editor,
  onImageUpload,
  uploading,
}: EditorToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL ссылки", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await onImageUpload(file);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        alignItems: "center",
        p: 1,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "grey.50",
      }}
    >
      <ButtonGroup size="small" variant="outlined">
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant={editor.isActive("heading", { level: 2 }) ? "contained" : "outlined"}
        >
          H2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          variant={editor.isActive("heading", { level: 3 }) ? "contained" : "outlined"}
        >
          H3
        </Button>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Жирный">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive("bold") ? "primary" : "default"}
            aria-label="Жирный"
          >
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Курсив">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive("italic") ? "primary" : "default"}
            aria-label="Курсив"
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Подчёркивание">
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            color={editor.isActive("underline") ? "primary" : "default"}
            aria-label="Подчёркивание"
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Маркированный список">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive("bulletList") ? "primary" : "default"}
            aria-label="Маркированный список"
          >
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Нумерованный список">
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color={editor.isActive("orderedList") ? "primary" : "default"}
            aria-label="Нумерованный список"
          >
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Цитата">
          <IconButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            color={editor.isActive("blockquote") ? "primary" : "default"}
            aria-label="Цитата"
          >
            <FormatQuoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="По левому краю">
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            aria-label="По левому краю"
          >
            <FormatAlignLeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="По центру">
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            aria-label="По центру"
          >
            <FormatAlignCenterIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="По правому краю">
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            aria-label="По правому краю"
          >
            <FormatAlignRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <Tooltip title="Ссылка">
        <IconButton onClick={setLink} aria-label="Ссылка">
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Изображение">
        <span>
          <IconButton
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            aria-label="Изображение"
          >
            {uploading ? (
              <CircularProgress size={18} />
            ) : (
              <ImageIcon fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={onFileChange}
      />

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Отменить">
          <span>
            <IconButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              aria-label="Отменить"
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Повторить">
          <span>
            <IconButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              aria-label="Повторить"
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
}
