import { Box, Button, Stack, Typography } from "@mui/material";
import { siteConfig } from "@/config/site";

export function CtaBanner({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: "16px",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        p: { xs: 2.5, md: 4 },
        bgcolor: "#ffffff",
        backgroundImage:
          "linear-gradient(135deg, rgba(46,125,255,0.06) 0%, rgba(0,191,166,0.05) 100%)",
      }}
    >
      <Stack spacing={1.75}>
        <Typography variant="h4" sx={{ maxWidth: 800 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.65 }}>
          {text}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", mt: 1 }}>
          <Button
            href="/contacts"
            variant="contained"
            size="large"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {siteConfig.primaryCta}
          </Button>
          <Button
            href="/cases"
            variant="outlined"
            size="large"
            sx={{ textTransform: "none" }}
          >
            Посмотреть кейсы
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

