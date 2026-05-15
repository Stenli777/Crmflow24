import { Box } from "@mui/material";
import type { PropsWithChildren } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";

export function BlogPageShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Section>{children}</Section>
      <Footer />
    </Box>
  );
}
