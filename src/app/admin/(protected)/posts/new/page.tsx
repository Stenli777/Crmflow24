import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminShell title="Новая статья">
      <PostForm categories={categories} tags={tags} postOptions={[]} />
    </AdminShell>
  );
}
