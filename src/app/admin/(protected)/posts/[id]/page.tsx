import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { VkPublishPanel } from "@/components/admin/posts/VkPublishPanel";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePostAction } from "@/lib/admin/posts/actions";
import { getVkConfig } from "@/lib/vk/config";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const [post, categories, tags, postOptions, vkLogs] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
        faqItems: { orderBy: { sortOrder: "asc" } },
        relatedServices: { orderBy: { sortOrder: "asc" } },
        relatedFrom: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.post.findMany({
      where: { id: { not: id } },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    prisma.vkPublicationLog.findMany({
      where: { postId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell
      title={`Статья: ${post.title}`}
      actions={
        <DeleteButton
          id={post.id}
          action={deletePostAction}
          confirmMessage="Удалить статью? Связанные данные будут удалены."
        />
      }
    >
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
        postOptions={postOptions}
      />
      <VkPublishPanel
        post={post}
        logs={vkLogs}
        dryRun={getVkConfig().dryRun}
      />
    </AdminShell>
  );
}
