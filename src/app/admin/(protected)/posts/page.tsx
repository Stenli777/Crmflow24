import {
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { PostStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { ButtonLink } from "@/components/admin/ButtonLink";
import {
  formatAdminDate,
  POST_STATUS_LABELS,
  VK_STATUS_LABELS,
} from "@/lib/admin/labels";
import { PostsFilters } from "@/components/admin/PostsFilters";
import {
  formatScrapDocRevision,
  isTestScrapDraftTitle,
  scrapImportListSelect,
} from "@/lib/scrap/admin";

type PageProps = {
  searchParams: Promise<{
    status?: string;
    categoryId?: string;
    source?: string;
  }>;
};

export default async function PostsPage({ searchParams }: PageProps) {
  const { status, categoryId, source } = await searchParams;

  const where: Prisma.PostWhereInput = {};

  if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    where.status = status as PostStatus;
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (source === "scrap") {
    where.scrapImports = { some: {} };
  } else if (source === "manual") {
    where.scrapImports = { none: {} };
  }

  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        category: { select: { name: true } },
        scrapImports: scrapImportListSelect,
      },
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
        currentSource={source}
      />
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Заголовок</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Источник</TableCell>
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
                <TableCell colSpan={9} align="center">
                  Статей пока нет
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const scrap = post.scrapImports[0];
                const isTestDraft = isTestScrapDraftTitle(post.title);

                return (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">{post.title}</Typography>
                        {isTestDraft && (
                          <Chip
                            size="small"
                            label="Test draft"
                            color="warning"
                            variant="outlined"
                            sx={{ alignSelf: "flex-start" }}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{post.slug}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={POST_STATUS_LABELS[post.status]}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {scrap ? (
                        <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
                          <Chip size="small" label="Scrap" color="info" variant="outlined" />
                          <Typography variant="caption" color="text.secondary">
                            {formatScrapDocRevision(scrap.documentId, scrap.revisionId)}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Вручную
                        </Typography>
                      )}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminShell>
  );
}
