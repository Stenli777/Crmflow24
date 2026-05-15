"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Paper, Stack, TextField } from "@mui/material";
import type { Tag } from "@prisma/client";
import type { AdminFormState } from "@/lib/admin/types";
import { createTagAction, updateTagAction } from "@/lib/admin/tags/actions";
import { siteSurfaces } from "@/theme/siteUi";
import { FormAlert } from "./FormAlert";

type TagFormProps = {
  tag?: Tag;
};

const initialState: AdminFormState = {};

export function TagForm({ tag }: TagFormProps) {
  const action = tag ? updateTagAction : createTagAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Paper
      component="form"
      action={formAction}
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: `${siteSurfaces.cardRadiusPx}px`,
        border: siteSurfaces.cardBorder,
        boxShadow: siteSurfaces.cardShadowSoft,
      }}
    >
      <FormAlert state={state} />
      <Stack spacing={2}>
        {tag ? <input type="hidden" name="id" value={tag.id} /> : null}
        <TextField name="name" label="Название" required defaultValue={tag?.name ?? ""} fullWidth />
        <TextField
          name="slug"
          label="Slug"
          helperText="Оставьте пустым для автогенерации"
          defaultValue={tag?.slug ?? ""}
          fullWidth
        />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? "Сохранение…" : "Сохранить"}
          </Button>
          <Button component={Link} href="/admin/tags" variant="outlined" color="inherit">
            Назад
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
