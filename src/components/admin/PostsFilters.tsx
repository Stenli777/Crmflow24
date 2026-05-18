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
  currentSource?: string;
};

const STATUSES: PostStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

const SOURCE_OPTIONS = [
  { value: "", label: "Все источники" },
  { value: "scrap", label: "Scrap imports" },
  { value: "manual", label: "Вручную" },
] as const;

export function PostsFilters({
  categories,
  currentStatus,
  currentCategoryId,
  currentSource,
}: PostsFiltersProps) {
  const router = useRouter();

  const apply = (status: string, categoryId: string, source: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (categoryId) params.set("categoryId", categoryId);
    if (source) params.set("source", source);
    const q = params.toString();
    router.push(q ? `/admin/posts?${q}` : "/admin/posts");
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ flexWrap: "wrap" }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="filter-status">Статус</InputLabel>
          <Select
            labelId="filter-status"
            label="Статус"
            value={currentStatus ?? ""}
            onChange={(e) =>
              apply(e.target.value, currentCategoryId ?? "", currentSource ?? "")
            }
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
            onChange={(e) =>
              apply(currentStatus ?? "", e.target.value, currentSource ?? "")
            }
          >
            <MenuItem value="">Все</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="filter-source">Источник</InputLabel>
          <Select
            labelId="filter-source"
            label="Источник"
            value={currentSource ?? ""}
            onChange={(e) =>
              apply(currentStatus ?? "", currentCategoryId ?? "", e.target.value)
            }
          >
            {SOURCE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
