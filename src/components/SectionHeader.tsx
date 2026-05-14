import { Stack, Typography } from "@mui/material";
import { siteLayout } from "@/theme/siteUi";

export type SectionHeaderProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  /** Заголовок секции на главной и внутренних страницах */
  level?: "section" | "subsection";
  /** HTML-уровень заголовка для семантики */
  titleComponent?: "h2" | "h3" | "h4";
  /** Меньший отступ снизу (подзаголовки внутри одной «колонки» страницы) */
  dense?: boolean;
};

/**
 * Заголовок секции внутри страницы (не путать с {@link PageHero}).
 */
export function SectionHeader({
  kicker,
  title,
  subtitle,
  level = "section",
  titleComponent,
  dense,
}: SectionHeaderProps) {
  const resolvedTitleComponent =
    titleComponent ?? (level === "subsection" ? "h3" : "h2");
  const titleVariant = level === "subsection" ? "h5" : "h3";
  const titleSx =
    level === "subsection"
      ? {
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.35,
          maxWidth: siteLayout.articleMaxPx,
        }
      : { maxWidth: 800 };

  return (
    <Stack spacing={1.25} sx={{ mb: dense ? 1.5 : { xs: 2.5, md: 3 } }}>
      {kicker ? (
        <Typography
          variant="overline"
          sx={{ color: "primary.main", letterSpacing: "0.12em", fontWeight: 700 }}
        >
          {kicker}
        </Typography>
      ) : null}
      <Typography component={resolvedTitleComponent} variant={titleVariant} sx={titleSx}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          component="p"
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: siteLayout.heroLeadMaxPx, lineHeight: 1.65 }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}
