"use client";

import { useActionState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { loginAdminAction, type LoginAdminState } from "@/lib/auth/actions";
import { siteSurfaces } from "@/theme/siteUi";

const initialState: LoginAdminState = {};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAdminAction,
    initialState,
  );

  return (
    <Paper
      component="form"
      action={formAction}
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        p: { xs: 3, sm: 4 },
        borderRadius: `${siteSurfaces.cardRadiusPx}px`,
        border: siteSurfaces.cardBorder,
        boxShadow: siteSurfaces.cardShadowSoft,
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Вход в админку
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CRM Flow24 — управление блогом
          </Typography>
        </Box>

        {state.error ? (
          <Alert severity="error" role="alert">
            {state.error}
          </Alert>
        ) : null}

        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          fullWidth
          disabled={isPending}
        />

        <TextField
          name="password"
          label="Пароль"
          type="password"
          autoComplete="current-password"
          required
          fullWidth
          disabled={isPending}
        />

        <Button type="submit" variant="contained" size="large" disabled={isPending}>
          {isPending ? "Вход…" : "Войти"}
        </Button>
      </Stack>
    </Paper>
  );
}
