import Link from "next/link";
import Image from "next/image";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { formatPublicDate } from "@/lib/formatDate";
import type { BlogPostArticle } from "@/lib/blog/queries";

type BlogArticleHeaderProps = {
  post: BlogPostArticle;
};

export function BlogArticleHeader({ post }: BlogArticleHeaderProps) {
  const lead = post.summary?.trim() || post.excerpt?.trim();
  const showUpdated =
    post.publishedAt &&
    post.updatedAt.getTime() - post.publishedAt.getTime() > 60_000;

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
      >
        {post.category ? (
          <Link
            href={`/blog/category/${post.category.slug}`}
            style={{ textDecoration: "none" }}
          >
            <Chip
              clickable
              label={post.category.name}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Link>
        ) : null}
        {post.tags.map(({ tag }) => (
          <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
        ))}
      </Stack>

      <Typography component="h1" variant="h1">
        {post.title}
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ flexWrap: "wrap", color: "text.secondary" }}
      >
        {post.publishedAt ? (
          <Typography variant="body2">
            Опубликовано: {formatPublicDate(post.publishedAt)}
          </Typography>
        ) : null}
        {showUpdated ? (
          <Typography variant="body2">
            Обновлено: {formatPublicDate(post.updatedAt)}
          </Typography>
        ) : null}
      </Stack>

      {lead ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 720, lineHeight: 1.65, fontSize: "1.125rem" }}
        >
          {lead}
        </Typography>
      ) : null}

      {post.coverImage?.publicUrl ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 960,
            aspectRatio: "16 / 9",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "grey.100",
          }}
        >
          <Image
            src={post.coverImage.publicUrl}
            alt={post.coverImage.alt || post.title}
            fill
            priority
            sizes="(max-width: 960px) 100vw, 960px"
            style={{ objectFit: "cover" }}
          />
        </Box>
      ) : null}
    </Stack>
  );
}
