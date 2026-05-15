import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Box } from "@mui/material";
import { getCurrentAdmin } from "@/lib/auth/requireAdmin";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Вход в админку — CRM Flow24",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        bgcolor: "grey.50",
      }}
    >
      <AdminLoginForm />
    </Box>
  );
}
