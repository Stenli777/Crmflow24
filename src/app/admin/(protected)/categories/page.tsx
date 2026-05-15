import Link from "next/link";
import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatAdminDate } from "@/lib/admin/labels";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { posts: true } } },
  });

  return (
    <AdminShell
      title="Категории"
      actions={
        <Button component={Link} href="/admin/categories/new" variant="contained">
          Создать
        </Button>
      }
    >
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Активна</TableCell>
              <TableCell align="right">Порядок</TableCell>
              <TableCell align="right">Статей</TableCell>
              <TableCell>Обновлено</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} hover>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={cat.isActive ? "Да" : "Нет"}
                    color={cat.isActive ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">{cat.sortOrder}</TableCell>
                <TableCell align="right">{cat._count.posts}</TableCell>
                <TableCell>{formatAdminDate(cat.updatedAt)}</TableCell>
                <TableCell align="right">
                  <Button component={Link} href={`/admin/categories/${cat.id}`} size="small">
                    Изменить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminShell>
  );
}
