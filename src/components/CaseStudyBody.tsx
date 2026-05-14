import { Box, Chip, Stack, Typography } from "@mui/material";
import type { CaseItem } from "@/content/site-content";

export function CaseStudyBody({
  item,
  dense,
  showSummary = true,
}: {
  item: CaseItem;
  dense?: boolean;
  showSummary?: boolean;
}) {
  const spacing = dense ? 1 : 1.35;
  const bulletSize = dense ? "0.875rem" : "0.9375rem";

  return (
    <Stack spacing={spacing}>
      {showSummary ? (
        <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.62 }}>
          {item.summary}
        </Typography>
      ) : null}
      {item.tags.length > 0 ? (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {item.tags.map((tag) => (
            <Chip key={tag} size="small" label={tag} color="primary" variant="outlined" />
          ))}
        </Box>
      ) : null}
      <Box
        component="ul"
        sx={{
          m: 0,
          pl: 2.125,
          color: "text.secondary",
          "& li": { mb: dense ? 0.65 : 0.85, pl: 0.125 },
          "& li:last-of-type": { mb: 0 },
        }}
      >
        {item.highlights.map((line) => (
          <Typography
            key={line}
            component="li"
            variant="body2"
            sx={{ lineHeight: 1.55, fontSize: bulletSize }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    </Stack>
  );
}
