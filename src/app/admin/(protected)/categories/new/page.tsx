import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <AdminShell title="Новая категория">
      <CategoryForm />
    </AdminShell>
  );
}
