import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { TagForm } from "@/components/admin/TagForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteTagAction } from "@/lib/admin/tags/actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTagPage({ params }: PageProps) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id } });

  if (!tag) {
    notFound();
  }

  return (
    <AdminShell
      title={`Тег: ${tag.name}`}
      actions={
        <DeleteButton
          id={tag.id}
          action={deleteTagAction}
          confirmMessage="Удалить тег?"
        />
      }
    >
      <TagForm tag={tag} />
    </AdminShell>
  );
}
