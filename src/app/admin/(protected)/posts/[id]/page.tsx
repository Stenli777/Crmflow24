import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { VkPublishPanel } from "@/components/admin/posts/VkPublishPanel";
import { ScrapImportPanel } from "@/components/admin/posts/ScrapImportPanel";
import { TestDraftAlert } from "@/components/admin/posts/TestDraftAlert";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePostAction } from "@/lib/admin/posts/actions";
import { getVkConfig } from "@/lib/vk/config";
import { resolveVkImage } from "@/lib/vk/resolveVkImage";
import {
  isTestScrapDraftTitle,
  scrapImportDetailSelect,
} from "@/lib/scrap/admin";
import type { ScrapImportDetail } from "@/lib/scrap/admin";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const [post, categories, tags, postOptions, vkLogs, scrapImportRow] =
    await Promise.all([
      prisma.post.findUnique({
        where: { id },
        include: {
          tags: true,
          faqItems: { orderBy: { sortOrder: "asc" } },
          relatedServices: { orderBy: { sortOrder: "asc" } },
          relatedFrom: true,
          coverImage: { select: { publicUrl: true, mimeType: true } },
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
      prisma.scrapArticleImport.findFirst({
        where: { postId: id },
        orderBy: { importedAt: "desc" },
        select: scrapImportDetailSelect,
      }),
    ]);

  if (!post) {
    notFound();
  }

  const scrapImport: ScrapImportDetail | null = scrapImportRow;
  const isTestDraft = isTestScrapDraftTitle(post.title);
  const deleteConfirm = isTestDraft
    ? "Удалить тестовый smoke-черновик? Статья и запись Scrap import будут удалены безвозвратно."
    : "Удалить статью? Связанные данные будут удалены.";

  return (
    <AdminShell
      title={`Статья: ${post.title}`}
      actions={
        <DeleteButton
          id={post.id}
          action={deletePostAction}
          confirmMessage={deleteConfirm}
        />
      }
    >
      {isTestDraft && <TestDraftAlert title={post.title} />}
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
        postOptions={postOptions}
      />
      {scrapImport ? (
        <ScrapImportPanel scrapImport={scrapImport} />
      ) : null}
      <VkPublishPanel
        post={post}
        logs={vkLogs}
        dryRun={getVkConfig().dryRun}
        resolvedImage={resolveVkImage(post)}
      />
    </AdminShell>
  );
}
