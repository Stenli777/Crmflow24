import Link from "next/link";
import { Breadcrumbs, Typography } from "@mui/material";

export type BlogBreadcrumbItem = {
  label: string;
  href?: string;
};

type BlogBreadcrumbsProps = {
  items: BlogBreadcrumbItem[];
};

export function BlogBreadcrumbs({ items }: BlogBreadcrumbsProps) {
  return (
    <Breadcrumbs
      aria-label="Навигация"
      sx={{ mb: 2, "& .MuiBreadcrumbs-li": { fontSize: "0.875rem" } }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.href) {
          return (
            <Typography
              key={`${item.label}-${index}`}
              color={isLast ? "text.primary" : "text.secondary"}
              sx={{ fontWeight: isLast ? 600 : 400 }}
            >
              {item.label}
            </Typography>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Typography
              component="span"
              color="text.secondary"
              sx={{
                "&:hover": { color: "primary.main", textDecoration: "underline" },
              }}
            >
              {item.label}
            </Typography>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
