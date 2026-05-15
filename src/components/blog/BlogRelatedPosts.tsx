import { SectionHeader } from "@/components/SectionHeader";
import { BlogList } from "./BlogList";
import type { BlogPostCard } from "@/lib/blog/queries";

type BlogRelatedPostsProps = {
  posts: BlogPostCard[];
};

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeader title="Похожие статьи" />
      <BlogList
        posts={posts}
        emptyMessage="Нет похожих опубликованных статей."
      />
    </>
  );
}
