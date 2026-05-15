"use client";

import { Alert } from "@mui/material";
import type { AdminFormState } from "@/lib/admin/types";

export function FormAlert({ state }: { state: AdminFormState }) {
  if (state.error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {state.error}
      </Alert>
    );
  }
  if (state.success) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        {state.success}
      </Alert>
    );
  }
  return null;
}
