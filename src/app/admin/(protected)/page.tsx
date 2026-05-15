import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { logoutAdminAction } from "@/lib/auth/actions";
import { siteSurfaces } from "@/theme/siteUi";

const PLACEHOLDER_LINKS = [
  { label: "Статьи", hint: "этап 3+" },
  { label: "Категории", hint: "этап 3+" },
  { label: "Медиа", hint: "этап 4+" },
  { label: "Настройки", hint: "этап 5+" },
] as const;

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: `${siteSurfaces.cardRadiusPx}px`,
            border: siteSurfaces.cardBorder,
            boxShadow: siteSurfaces.cardShadowSoft,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Админка CRM Flow24
              </Typography>
              <Typography variant="body1" color="text.secondary">
                CMS-блог будет добавлен на следующих этапах.
              </Typography>
            </Box>

            <Typography variant="body2">
              Вы вошли как:{" "}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {admin.email}
              </Box>
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", rowGap: 1 }}
            >
              {PLACEHOLDER_LINKS.map((item) => (
                <Chip
                  key={item.label}
                  label={`${item.label} (${item.hint})`}
                  disabled
                  variant="outlined"
                />
              ))}
            </Stack>

            <Box>
              <form action={logoutAdminAction}>
                <Button type="submit" variant="outlined" color="inherit">
                  Выйти
                </Button>
              </form>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
