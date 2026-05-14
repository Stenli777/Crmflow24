"use client";

import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { siteConfig } from "@/config/site";
import { siteSurfaces } from "@/theme/siteUi";

const defaultContactHref = "/contacts#contact-form";

export function CtaBanner({
  title,
  text,
  contactHref = defaultContactHref,
}: {
  title: string;
  text: string;
  contactHref?: string;
}) {
  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: `${siteSurfaces.cardRadiusPx}px`,
        border: siteSurfaces.cardBorder,
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
            component={Link}
            href={contactHref}
            variant="contained"
            size="large"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {siteConfig.primaryCta}
          </Button>
          <Button
            component={Link}
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

