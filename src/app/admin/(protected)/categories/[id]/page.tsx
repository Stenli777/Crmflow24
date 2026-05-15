import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteCategoryAction } from "@/lib/admin/categories/actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

  return (
    <AdminShell
      title={`Категория: ${category.name}`}
      actions={
        <DeleteButton
          id={category.id}
          action={deleteCategoryAction}
          confirmMessage="Удалить категорию?"
        />
      }
    >
      <CategoryForm category={category} />
    </AdminShell>
  );
}
