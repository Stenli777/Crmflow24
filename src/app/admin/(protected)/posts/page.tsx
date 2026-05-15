import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { ButtonLink } from "@/components/admin/ButtonLink";
import {
  formatAdminDate,
  POST_STATUS_LABELS,
  VK_STATUS_LABELS,
} from "@/lib/admin/labels";
import { PostsFilters } from "@/components/admin/PostsFilters";

type PageProps = {
  searchParams: Promise<{ status?: string; categoryId?: string }>;
};

export default async function PostsPage({ searchParams }: PageProps) {
  const { status, categoryId } = await searchParams;

  const where: {
    status?: PostStatus;
    categoryId?: string;
  } = {};

  if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    where.status = status as PostStatus;
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: { category: { select: { name: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminShell
      title="Статьи"
      actions={
        <ButtonLink href="/admin/posts/new" variant="contained">
          Создать
        </ButtonLink>
      }
    >
      <PostsFilters
        categories={categories}
        currentStatus={status}
        currentCategoryId={categoryId}
      />
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Заголовок</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Опубликовано</TableCell>
              <TableCell>Обновлено</TableCell>
              <TableCell>VK</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Статей пока нет
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={POST_STATUS_LABELS[post.status]}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{post.category?.name ?? "—"}</TableCell>
                  <TableCell>{formatAdminDate(post.publishedAt)}</TableCell>
                  <TableCell>{formatAdminDate(post.updatedAt)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={VK_STATUS_LABELS[post.vkStatus]}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ButtonLink href={`/admin/posts/${post.id}`} size="small">
                      Изменить
                    </ButtonLink>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminShell>
  );
}
