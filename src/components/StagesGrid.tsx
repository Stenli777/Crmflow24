import { Box, Typography } from "@mui/material";
import { stages } from "@/content/site-content";

export function StagesGrid({ limit }: { limit?: number }) {
  const list = typeof limit === "number" ? stages.slice(0, limit) : stages;

  return (
    <Box
      sx={{
        mt: 2.5,
        display: "grid",
        gap: 2,
      }}
    >
      {list.map((item, index) => (
        <Box
          key={item.step}
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "36px 1fr",
            gap: 1.5,
          }}
        >
          <Box sx={{ position: "relative", pt: 0.5 }}>
            {index !== list.length - 1 && (
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: 24,
                  transform: "translateX(-50%)",
                  width: 2,
                  height: "calc(100% + 14px)",
                  backgroundColor: "rgba(46,125,255,0.2)",
                }}
              />
            )}
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid rgba(46,125,255,0.28)",
                background: "linear-gradient(135deg, rgba(46,125,255,0.92) 0%, rgba(0,191,166,0.85) 100%)",
                boxShadow: "0 0 0 3px rgba(46,125,255,0.06)",
              }}
            />
          </Box>
          <Box
            sx={{
              border: "1px solid rgba(15, 23, 42, 0.08)",
              borderRadius: "16px",
              p: { xs: 1.5, md: 2 },
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="overline" sx={{ color: "primary.main", display: "block" }}>
              Этап {item.step}
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.9, lineHeight: 1.6 }}>
              {item.details}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

