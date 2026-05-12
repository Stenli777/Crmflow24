import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { cases } from "@/content/site-content";

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
          <Box sx={{ p: 1.5, pb: 0 }}>
            <Image
              src="/images/case-placeholder.svg"
              alt={`Иллюстрация кейса: ${item.title}`}
              width={800}
              height={460}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 14,
                filter: "saturate(1.04) contrast(1.02)",
              }}
            />
          </Box>
          <CardContent>
            <Stack spacing={1.2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Chip size="small" label={item.niche} />
              </Box>
              <Typography>
                <b>Задача:</b> {item.problem}
              </Typography>
              <Typography>
                <b>Решение:</b> {item.solution}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Результат:</Typography>
                <Box component="ul" sx={{ pl: 2.5, m: 0, color: "text.secondary" }}>
                  {item.result.map((line) => (
                    <li key={line}>
                      <Typography color="text.secondary">{line}</Typography>
                    </li>
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", pt: 0.6 }}>
                {item.result.slice(0, 2).map((metric) => (
                  <Chip key={metric} size="small" color="primary" variant="outlined" label={metric} />
                ))}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

