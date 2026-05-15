import Link from "next/link";
import {
  Button,
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

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <AdminShell
      title="Теги"
      actions={
        <Button component={Link} href="/admin/tags/new" variant="contained">
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
              <TableCell align="right">Статей</TableCell>
              <TableCell>Обновлено</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id} hover>
                <TableCell>{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell align="right">{tag._count.posts}</TableCell>
                <TableCell>{formatAdminDate(tag.updatedAt)}</TableCell>
                <TableCell align="right">
                  <Button component={Link} href={`/admin/tags/${tag.id}`} size="small">
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
