import { Box, Typography } from "@mui/material";
import { stages } from "@/content/site-content";
import { CardShell } from "@/components/CardShell";
import { siteSurfaces } from "@/theme/siteUi";

export function StagesGrid({ limit }: { limit?: number }) {
  const list = typeof limit === "number" ? stages.slice(0, limit) : stages;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
        gap: { xs: 1.75, md: 2 },
      }}
    >
      {list.map((item, index) => (
        <CardShell
          key={item.step}
          hoverLift
          sx={{
            position: "relative",
            height: "100%",
            p: { xs: 1.75, md: 2.25 },
            pt: { xs: 2.25, md: 2.5 },
            boxShadow: siteSurfaces.cardShadowSoft,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              minWidth: 36,
              height: 28,
              px: 1,
              borderRadius: "999px",
              bgcolor: "rgba(46, 125, 255, 0.08)",
              border: "1px solid rgba(46, 125, 255, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "primary.main",
              letterSpacing: "0.04em",
            }}
          >
            {item.step}
          </Box>
          <Typography
            variant="overline"
            sx={{ color: "text.secondary", display: "block", letterSpacing: "0.1em", fontWeight: 700, mb: 0.75 }}
          >
            Шаг {index + 1}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em", pr: 5, lineHeight: 1.25 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.1, lineHeight: 1.62 }}>
            {item.details}
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: siteSurfaces.dividerSubtle,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main", letterSpacing: "0.04em" }}>
              Итог этапа
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.55 }}>
              {item.outcome}
            </Typography>
          </Box>
        </CardShell>
      ))}
    </Box>
  );
}
