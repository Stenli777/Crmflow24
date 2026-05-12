import { Container, Box } from "@mui/material";
import type { PropsWithChildren } from "react";

export function Section({
  id,
  children,
  tone = "plain",
}: PropsWithChildren<{ id?: string; tone?: "plain" | "muted" }>) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        py: { xs: 7, md: 10 },
        bgcolor: tone === "muted" ? "rgba(0,0,0,0.02)" : "transparent",
      }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}

