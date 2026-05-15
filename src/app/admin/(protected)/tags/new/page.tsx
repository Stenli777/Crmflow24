import { AdminShell } from "@/components/admin/AdminShell";
import { TagForm } from "@/components/admin/TagForm";

export default function NewTagPage() {
  return (
    <AdminShell title="Новый тег">
      <TagForm />
    </AdminShell>
  );
}
