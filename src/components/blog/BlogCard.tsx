import Link from "next/link";
import Image from "next/image";
import {
  Box,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { CardShell } from "@/components/CardShell";
import { formatPublicDate } from "@/lib/formatDate";
import type { BlogPostCard } from "@/lib/blog/queries";

type BlogCardProps = {
  post: BlogPostCard;
};

export function BlogCard({ post }: BlogCardProps) {
  const lead = post.summary?.trim() || post.excerpt?.trim() || "";
  const coverUrl = post.coverImage?.publicUrl;
  const coverAlt = post.coverImage?.alt || post.title;

  return (
    <CardShell hoverLift sx={{ height: "100%" }}>
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
      >
      <CardActionArea
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {coverUrl ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              bgcolor: "grey.100",
            }}
          >
            <Image
              src={coverUrl}
              alt={coverAlt}
              fill
              sizes="(max-width: 600px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </Box>
        ) : null}
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {post.category ? (
              <Chip
                size="small"
                label={post.category.name}
                component="span"
                sx={{ pointerEvents: "none" }}
              />
            ) : null}
            {post.tags.map(({ tag }) => (
              <Chip
                key={tag.id}
                size="small"
                variant="outlined"
                label={tag.name}
                component="span"
                sx={{ pointerEvents: "none" }}
              />
            ))}
          </Stack>
          <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
            {post.title}
          </Typography>
          {lead ? (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, flex: 1 }}>
              {lead}
            </Typography>
          ) : null}
          {post.publishedAt ? (
            <Typography variant="caption" color="text.secondary">
              {formatPublicDate(post.publishedAt)}
            </Typography>
          ) : null}
        </CardContent>
      </CardActionArea>
      </Link>
    </CardShell>
  );
}
