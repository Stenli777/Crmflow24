"use client";

import { Box, Typography } from "@mui/material";

const r = "16px";

type MediaPlaceholderProps = {
  /** Подпись для контент-менеджера: куда поставить изображение */
  label: string;
  /** Соотношение сторон контейнера (CSS aspect-ratio) */
  aspectRatio?: string;
  minHeight?: number | { xs?: number; md?: number };
};

/**
 * Визуальный слот под будущее изображение. Замените блок на next/image или Box с background при появлении ассетов.
 */
export function MediaPlaceholder({ label, aspectRatio = "16 / 9", minHeight }: MediaPlaceholderProps) {
  return (
    <Box
      sx={{
        borderRadius: r,
        border: "1px dashed rgba(15, 23, 42, 0.2)",
        bgcolor: "rgba(248, 250, 252, 0.9)",
        px: 2,
        py: { xs: 2.5, md: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        aspectRatio,
        minHeight: minHeight ?? { xs: 120, md: 140 },
        transition: "border-color 180ms ease, background-color 180ms ease",
        "&:hover": {
          borderColor: "rgba(46, 125, 255, 0.35)",
          bgcolor: "rgba(46, 125, 255, 0.04)",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ maxWidth: 360, lineHeight: 1.55, fontWeight: 600, letterSpacing: "0.01em" }}
      >
        {label}
      </Typography>
    </Box>
  );
}
