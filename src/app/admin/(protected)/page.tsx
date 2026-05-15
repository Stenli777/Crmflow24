import { Box, Paper, Stack, Typography } from "@mui/material";
import { AdminShell } from "@/components/admin/AdminShell";
import { ButtonLink } from "@/components/admin/ButtonLink";
import { siteSurfaces } from "@/theme/siteUi";

const LINKS = [
  { href: "/admin/posts", label: "Статьи", description: "Создание и редактирование материалов блога" },
  { href: "/admin/categories", label: "Категории", description: "Рубрики для группировки статей" },
  { href: "/admin/tags", label: "Теги", description: "Метки для фильтрации и навигации" },
] as const;

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Панель админки">
      <Stack spacing={2}>
        {LINKS.map((item) => (
          <Paper
            key={item.href}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: `${siteSurfaces.cardRadiusPx}px`,
              border: siteSurfaces.cardBorder,
              boxShadow: siteSurfaces.cardShadowSoft,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Box>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
              <ButtonLink href={item.href} variant="contained">
                Открыть
              </ButtonLink>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </AdminShell>
  );
}
