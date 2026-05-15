"use client";

import { useRouter } from "next/navigation";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
} from "@mui/material";
import type { Category } from "@prisma/client";
import { POST_STATUS_LABELS } from "@/lib/admin/labels";
import type { PostStatus } from "@prisma/client";

type PostsFiltersProps = {
  categories: Category[];
  currentStatus?: string;
  currentCategoryId?: string;
};

const STATUSES: PostStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function PostsFilters({
  categories,
  currentStatus,
  currentCategoryId,
}: PostsFiltersProps) {
  const router = useRouter();

  const apply = (status: string, categoryId: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (categoryId) params.set("categoryId", categoryId);
    const q = params.toString();
    router.push(q ? `/admin/posts?${q}` : "/admin/posts");
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="filter-status">Статус</InputLabel>
          <Select
            labelId="filter-status"
            label="Статус"
            value={currentStatus ?? ""}
            onChange={(e) => apply(e.target.value, currentCategoryId ?? "")}
          >
            <MenuItem value="">Все</MenuItem>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {POST_STATUS_LABELS[s]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="filter-category">Категория</InputLabel>
          <Select
            labelId="filter-category"
            label="Категория"
            value={currentCategoryId ?? ""}
            onChange={(e) => apply(currentStatus ?? "", e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
