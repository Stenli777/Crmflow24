import type { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { logoutAdminAction } from "@/lib/auth/actions";

const NAV = [
  { href: "/admin", label: "Панель", exact: true },
  { href: "/admin/posts", label: "Статьи" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/tags", label: "Теги" },
] as const;

type AdminShellProps = PropsWithChildren<{
  title: string;
  actions?: ReactNode;
}>;

export async function AdminShell({ title, actions, children }: AdminShellProps) {
  const admin = await requireAdmin();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, mr: 1 }}>
            CRM Flow24
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", flex: 1 }}>
            {NAV.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                size="small"
                color="inherit"
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            {admin.email}
          </Typography>
          <form action={logoutAdminAction}>
            <Button type="submit" size="small" variant="outlined" color="inherit">
              Выйти
            </Button>
          </form>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 3,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          {actions ? <Box>{actions}</Box> : null}
        </Stack>
        {children}
      </Container>
    </Box>
  );
}
