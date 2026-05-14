import { Box, CardContent, Chip, Stack, Typography } from "@mui/material";
import { CardShell } from "@/components/CardShell";
import { cases } from "@/content/site-content";
import { CaseStudyBody } from "@/components/CaseStudyBody";

export function CasesGrid({ limit }: { limit?: number }) {
  const list = typeof limit === "number" ? cases.slice(0, limit) : cases;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2.5,
      }}
    >
      {list.map((item) => (
        <CardShell key={item.title} hoverLift sx={{ overflow: "hidden" }}>
          <CardContent sx={{ pt: 2.5 }}>
            <Stack spacing={1.25}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, flex: "1 1 200px" }}>
                  {item.title}
                </Typography>
                <Chip size="small" label={item.niche} sx={{ alignSelf: "flex-start" }} />
              </Box>
              <CaseStudyBody item={item} dense />
            </Stack>
          </CardContent>
        </CardShell>
      ))}
    </Box>
  );
}
