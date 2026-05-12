import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { services } from "@/content/site-content";

export function ServicesGrid({ limit }: { limit?: number }) {
  const list = typeof limit === "number" ? services.slice(0, limit) : services;

  return (
    <Box
      sx={{
        mt: 2.5,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 2.5,
      }}
    >
      {list.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: "16px",
              transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
                borderColor: "rgba(46,125,255,0.28)",
              },
            }}
          >
            <CardContent>
              <Stack spacing={1.25}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(46,125,255,0.12)",
                      color: "primary.main",
                      boxShadow: "inset 0 0 0 1px rgba(46,125,255,0.15)",
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{item.value}</Typography>
                <Typography color="text.secondary">{item.details}</Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

