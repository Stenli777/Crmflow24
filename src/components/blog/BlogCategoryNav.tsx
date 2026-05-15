import Link from "next/link";
import { Chip, Stack, Typography } from "@mui/material";

type CategoryItem = {
  name: string;
  slug: string;
  postCount: number;
};

type BlogCategoryNavProps = {
  categories: CategoryItem[];
  activeSlug?: string;
};

export function BlogCategoryNav({ categories, activeSlug }: BlogCategoryNavProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1.5} sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Категории
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Link href="/blog" style={{ textDecoration: "none" }}>
          <Chip
            clickable
            label="Все статьи"
            color={activeSlug ? "default" : "primary"}
            variant={activeSlug ? "outlined" : "filled"}
          />
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            style={{ textDecoration: "none" }}
          >
            <Chip
              clickable
              label={`${cat.name}${cat.postCount > 0 ? ` (${cat.postCount})` : ""}`}
              color={activeSlug === cat.slug ? "primary" : "default"}
              variant={activeSlug === cat.slug ? "filled" : "outlined"}
            />
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}
