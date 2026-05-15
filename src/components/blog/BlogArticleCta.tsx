import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { siteSurfaces } from "@/theme/siteUi";

const DEFAULT_CTA = {
  title: "Нужна CRM без хаоса в продажах?",
  text: "Разберём вашу текущую систему, найдём узкие места и предложим понятный план настройки Битрикс24.",
  buttonLabel: "Оставить заявку",
  buttonHref: "/contacts",
} as const;

type BlogArticleCtaProps = {
  title?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
};

export function BlogArticleCta({
  title,
  text,
  buttonLabel,
  buttonHref,
}: BlogArticleCtaProps) {
  const resolvedTitle = title?.trim() || DEFAULT_CTA.title;
  const resolvedText = text?.trim() || DEFAULT_CTA.text;
  const resolvedLabel = buttonLabel?.trim() || DEFAULT_CTA.buttonLabel;
  const resolvedHref = buttonHref?.trim() || DEFAULT_CTA.buttonHref;

  return (
    <Box
      sx={{
        my: 3,
        borderRadius: `${siteSurfaces.cardRadiusPx}px`,
        border: siteSurfaces.cardBorder,
        p: { xs: 2.5, md: 3.5 },
        bgcolor: "#ffffff",
        backgroundImage:
          "linear-gradient(135deg, rgba(46,125,255,0.06) 0%, rgba(0,191,166,0.05) 100%)",
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="h4" sx={{ fontWeight: 700, maxWidth: 720 }}>
          {resolvedTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.65 }}>
          {resolvedText}
        </Typography>
        <Box>
          <Link href={resolvedHref} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              {resolvedLabel}
            </Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}
