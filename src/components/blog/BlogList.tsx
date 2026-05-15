import { Box, Typography } from "@mui/material";
import { BlogCard } from "./BlogCard";
import type { BlogPostCard } from "@/lib/blog/queries";

type BlogListProps = {
  posts: BlogPostCard[];
  emptyMessage?: string;
};

const defaultEmpty =
  "Пока нет опубликованных статей. Скоро здесь появятся материалы о внедрении CRM и автоматизации продаж.";

export function BlogList({
  posts,
  emptyMessage = defaultEmpty,
}: BlogListProps) {
  if (posts.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ lineHeight: 1.65, maxWidth: 720 }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 2.5,
      }}
    >
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </Box>
  );
}
