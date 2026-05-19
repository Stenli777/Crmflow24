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
  ToggleButton,
  ToggleButtonGroup,
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
import CodeIcon from "@mui/icons-material/Code";
import { applyHeadingToSelection } from "./headingCommands";
import { preventToolbarFocusLoss } from "./selectionStorage";

export type EditorViewMode = "visual" | "html";

type EditorToolbarProps = {
  editor: Editor | null;
  onImageUpload: (file: File) => Promise<void>;
  uploading: boolean;
  viewMode: EditorViewMode;
  onViewModeChange: (mode: EditorViewMode) => void;
};

export function EditorToolbar({
  editor,
  onImageUpload,
  uploading,
  viewMode,
  onViewModeChange,
}: EditorToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const visualDisabled = viewMode === "html";

  if (!editor) {
    return null;
  }

  const runVisualCommand = (run: () => void) => {
    if (visualDisabled) return;
    run();
  };

  const setLink = () => {
    runVisualCommand(() => {
      const previous = editor.getAttributes("link").href as string | undefined;
      const url = window.prompt("URL ссылки", previous ?? "https://");
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    });
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
      <ToggleButtonGroup
        size="small"
        exclusive
        value={viewMode}
        onChange={(_, value: EditorViewMode | null) => {
          if (value) onViewModeChange(value);
        }}
        aria-label="Режим редактора"
      >
        <ToggleButton value="visual" aria-label="Визуальный режим">
          Визуальный
        </ToggleButton>
        <ToggleButton value="html" aria-label="HTML">
          HTML
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined" disabled={visualDisabled}>
        <Button
          onMouseDown={preventToolbarFocusLoss(() =>
            runVisualCommand(() => applyHeadingToSelection(editor, 2)),
          )}
          variant={editor.isActive("heading", { level: 2 }) ? "contained" : "outlined"}
        >
          H2
        </Button>
        <Button
          onMouseDown={preventToolbarFocusLoss(() =>
            runVisualCommand(() => applyHeadingToSelection(editor, 3)),
          )}
          variant={editor.isActive("heading", { level: 3 }) ? "contained" : "outlined"}
        >
          H3
        </Button>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined" disabled={visualDisabled}>
        <Tooltip title="Жирный">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().toggleBold().run()),
              )}
              color={editor.isActive("bold") ? "primary" : "default"}
              aria-label="Жирный"
              disabled={visualDisabled}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Курсив">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().toggleItalic().run()),
              )}
              color={editor.isActive("italic") ? "primary" : "default"}
              aria-label="Курсив"
              disabled={visualDisabled}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Подчёркивание">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().toggleUnderline().run()),
              )}
              color={editor.isActive("underline") ? "primary" : "default"}
              aria-label="Подчёркивание"
              disabled={visualDisabled}
            >
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined" disabled={visualDisabled}>
        <Tooltip title="Маркированный список">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().toggleBulletList().run()),
              )}
              color={editor.isActive("bulletList") ? "primary" : "default"}
              aria-label="Маркированный список"
              disabled={visualDisabled}
            >
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Нумерованный список">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().toggleOrderedList().run()),
              )}
              color={editor.isActive("orderedList") ? "primary" : "default"}
              aria-label="Нумерованный список"
              disabled={visualDisabled}
            >
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Цитата">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().toggleBlockquote().run()),
              )}
              color={editor.isActive("blockquote") ? "primary" : "default"}
              aria-label="Цитата"
              disabled={visualDisabled}
            >
              <FormatQuoteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <ButtonGroup size="small" variant="outlined" disabled={visualDisabled}>
        <Tooltip title="По левому краю">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().setTextAlign("left").run()),
              )}
              aria-label="По левому краю"
              disabled={visualDisabled}
            >
              <FormatAlignLeftIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="По центру">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().setTextAlign("center").run()),
              )}
              aria-label="По центру"
              disabled={visualDisabled}
            >
              <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="По правому краю">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().setTextAlign("right").run()),
              )}
              aria-label="По правому краю"
              disabled={visualDisabled}
            >
              <FormatAlignRightIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </ButtonGroup>

      <Divider flexItem orientation="vertical" />

      <Tooltip title="Ссылка">
        <span>
          <IconButton
            onMouseDown={preventToolbarFocusLoss(setLink)}
            aria-label="Ссылка"
            disabled={visualDisabled}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Изображение">
        <span>
          <IconButton
            onMouseDown={preventToolbarFocusLoss(() => fileRef.current?.click())}
            disabled={uploading || visualDisabled}
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

      <ButtonGroup size="small" variant="outlined" disabled={visualDisabled}>
        <Tooltip title="Отменить">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().undo().run()),
              )}
              disabled={visualDisabled || !editor.can().undo()}
              aria-label="Отменить"
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Повторить">
          <span>
            <IconButton
              onMouseDown={preventToolbarFocusLoss(() =>
                runVisualCommand(() => editor.chain().focus().redo().run()),
              )}
              disabled={visualDisabled || !editor.can().redo()}
              aria-label="Повторить"
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </ButtonGroup>

      {viewMode === "html" ? (
        <>
          <Divider flexItem orientation="vertical" />
          <Tooltip title="Редактирование HTML-кода статьи">
            <CodeIcon fontSize="small" color="action" aria-hidden />
          </Tooltip>
        </>
      ) : null}
    </Box>
  );
}
