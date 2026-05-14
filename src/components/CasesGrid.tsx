import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { cases } from "@/content/site-content";
import { CaseStudyBody } from "@/components/CaseStudyBody";

export function CasesGrid({ limit }: { limit?: number }) {
  const list = typeof limit === "number" ? cases.slice(0, limit) : cases;

  return (
    <Box
      sx={{
        mt: 2.5,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2.5,
      }}
    >
      {list.map((item) => (
        <Card
          key={item.title}
          variant="outlined"
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
              borderColor: "rgba(46,125,255,0.28)",
            },
          }}
        >
          <CardContent sx={{ pt: 2.5 }}>
            <Stack spacing={1.25}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, flex: "1 1 240px" }}>
                  {item.title}
                </Typography>
                <Chip size="small" label={item.niche} sx={{ alignSelf: "flex-start" }} />
              </Box>
              <CaseStudyBody item={item} dense />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
