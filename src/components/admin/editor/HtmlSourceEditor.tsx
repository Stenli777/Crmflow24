"use client";

import { TextField } from "@mui/material";

type HtmlSourceEditorProps = {
  value: string;
  onChange: (html: string) => void;
  error?: string | null;
};

export function HtmlSourceEditor({ value, onChange, error }: HtmlSourceEditorProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiline
      minRows={14}
      maxRows={40}
      fullWidth
      error={Boolean(error)}
      helperText={
        error ??
        "Редактирование HTML. При возврате в визуальный режим разметка проходит санитизацию (безопасные теги статей)."
      }
      spellCheck={false}
      slotProps={{
        htmlInput: {
          "aria-label": "HTML-код статьи",
          style: {
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.875rem",
            lineHeight: 1.5,
          },
        },
      }}
      sx={{
        "& .MuiInputBase-root": { alignItems: "flex-start", borderRadius: 0 },
        "& fieldset": { border: "none" },
      }}
    />
  );
}
