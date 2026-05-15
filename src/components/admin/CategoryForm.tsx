"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import type { Category } from "@prisma/client";
import type { AdminFormState } from "@/lib/admin/types";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/admin/categories/actions";
import { siteSurfaces } from "@/theme/siteUi";
import { FormAlert } from "./FormAlert";

type CategoryFormProps = {
  category?: Category;
};

const initialState: AdminFormState = {};

export function CategoryForm({ category }: CategoryFormProps) {
  const action = category ? updateCategoryAction : createCategoryAction;
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
        {category ? <input type="hidden" name="id" value={category.id} /> : null}
        <TextField name="name" label="Название" required defaultValue={category?.name ?? ""} fullWidth />
        <TextField
          name="slug"
          label="Slug"
          helperText="Оставьте пустым для автогенерации из названия"
          defaultValue={category?.slug ?? ""}
          fullWidth
        />
        <TextField
          name="description"
          label="Описание"
          multiline
          minRows={3}
          defaultValue={category?.description ?? ""}
          fullWidth
        />
        <TextField name="seoTitle" label="SEO title" defaultValue={category?.seoTitle ?? ""} fullWidth />
        <TextField
          name="seoDescription"
          label="SEO description"
          multiline
          minRows={2}
          defaultValue={category?.seoDescription ?? ""}
          fullWidth
        />
        <TextField
          name="sortOrder"
          label="Порядок сортировки"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox name="isActive" defaultChecked={category?.isActive ?? true} />
          }
          label="Активна"
        />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? "Сохранение…" : "Сохранить"}
          </Button>
          <Button component={Link} href="/admin/categories" variant="outlined" color="inherit">
            Назад
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
