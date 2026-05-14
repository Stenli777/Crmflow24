import { Stack, Typography } from "@mui/material";
import { siteLayout } from "@/theme/siteUi";

export type PageHeroProps = {
  title: string;
  subtitle?: string;
};

/**
 * Единый первый экран внутренних страниц: H1, лид и отступ до следующего блока.
 */
export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <Stack
      component="header"
      spacing={1.5}
      sx={{
        mb: { xs: 3, md: 4 },
      }}
    >
      <Typography component="h1" variant="h1" sx={{ maxWidth: siteLayout.heroTitleMaxPx }}>
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
