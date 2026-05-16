"use client";

import { useActionState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  PostStatus,
  VkPublicationStatus,
  type Post,
  type VkPublicationLog,
} from "@prisma/client";
import { publishPostToVkAction } from "@/lib/admin/posts/vkActions";
import { VK_STATUS_LABELS, formatAdminDate } from "@/lib/admin/labels";
import type { AdminFormState } from "@/lib/admin/types";
import type { ResolvedVkImage } from "@/lib/vk/resolveVkImage";
import { VK_IMAGE_SOURCE_LABELS } from "@/lib/vk/resolveVkImage";
import { siteSurfaces } from "@/theme/siteUi";
import { FormAlert } from "../FormAlert";

type VkPublishPanelProps = {
  post: Pick<
    Post,
    "id" | "status" | "vkStatus" | "vkPostUrl" | "vkPublishedAt" | "vkText"
  >;
  logs: VkPublicationLog[];
  dryRun: boolean;
  resolvedImage: ResolvedVkImage | null;
};

const initialState: AdminFormState = {};

function attachmentFromLog(log: VkPublicationLog): string | null {
  const raw = log.rawResponse;
  if (!raw || typeof raw !== "object") return null;
  const record = raw as {
    attachments?: string | null;
    image?: { attachment?: string };
  };
  if (typeof record.attachments === "string") return record.attachments;
  if (record.image?.attachment) return record.image.attachment;
  return null;
}

export function VkPublishPanel({
  post,
  logs,
  dryRun,
  resolvedImage,
}: VkPublishPanelProps) {
  const [state, formAction, pending] = useActionState(
    publishPostToVkAction,
    initialState,
  );

  const isPublishedOnSite = post.status === PostStatus.PUBLISHED;
  const vkPublished = post.vkStatus === VkPublicationStatus.PUBLISHED;
  const primaryLabel = dryRun
    ? "Проверить VK публикацию (dry-run)"
    : "Опубликовать во ВКонтакте";
  const republishLabel = dryRun
    ? "Проверить повторно (dry-run)"
    : "Опубликовать повторно";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mt: 3,
        borderRadius: `${siteSurfaces.cardRadiusPx}px`,
        border: siteSurfaces.cardBorder,
        boxShadow: siteSurfaces.cardShadowSoft,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Публикация во ВКонтакте
      </Typography>

      <FormAlert state={state} />

      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Текст для VK — в форме статьи выше.{" "}
          {dryRun
            ? "Dry-run: VK API и upload изображения не выполняются."
            : "Реальная публикация (VK_DRY_RUN=false)."}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ flexWrap: "wrap" }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Статус VK
            </Typography>
            <Typography variant="body1">
              {VK_STATUS_LABELS[post.vkStatus]}
            </Typography>
          </Box>
          {post.vkPostUrl ? (
            <Box>
              <Typography variant="caption" color="text.secondary">
                URL поста VK
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                <a href={post.vkPostUrl} target="_blank" rel="noopener noreferrer">
                  {post.vkPostUrl}
                </a>
              </Typography>
            </Box>
          ) : null}
          {post.vkPublishedAt ? (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Последняя публикация
              </Typography>
              <Typography variant="body1">
                {formatAdminDate(post.vkPublishedAt)}
              </Typography>
            </Box>
          ) : null}
        </Stack>

        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Изображение для VK
          </Typography>
          {resolvedImage ? (
            <Stack spacing={0.5}>
              <Typography variant="body2">
                Источник: {VK_IMAGE_SOURCE_LABELS[resolvedImage.source]}
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                <a href={resolvedImage.url} target="_blank" rel="noopener noreferrer">
                  {resolvedImage.url}
                </a>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dryRun
                  ? "В dry-run файл не загружается в VK; в логе будет preview attachment."
                  : "Будет загружено на сервер VK и прикреплено к посту."}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Изображение не найдено (обложка / OG / img в тексте). Пост уйдёт только с
              текстом и ссылкой.
            </Typography>
          )}
        </Box>

        {vkPublished ? (
          <Alert severity="warning">
            Статья уже опубликована в VK. Повторная отправка создаст{" "}
            <strong>новый</strong> пост на стене.
          </Alert>
        ) : null}

        {isPublishedOnSite ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            {!vkPublished ? (
              <form action={formAction}>
                <input type="hidden" name="postId" value={post.id} />
                <Button type="submit" variant="contained" disabled={pending}>
                  {pending ? "Отправка…" : primaryLabel}
                </Button>
              </form>
            ) : null}
            {vkPublished ? (
              <form action={formAction}>
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="forceRepublish" value="1" />
                <Button
                  type="submit"
                  variant="outlined"
                  color="warning"
                  disabled={pending}
                >
                  {pending ? "Отправка…" : republishLabel}
                </Button>
              </form>
            ) : null}
          </Stack>
        ) : (
          <Typography variant="body2" color="warning.main">
            Сначала опубликуйте статью на сайте (статус «Опубликовано»).
          </Typography>
        )}

        {logs.length > 0 ? (
          <Box sx={{ overflowX: "auto" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Последние попытки ({logs.length})
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Attachment</TableCell>
                  <TableCell>Ошибка</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatAdminDate(log.createdAt)}</TableCell>
                    <TableCell>{VK_STATUS_LABELS[log.status]}</TableCell>
                    <TableCell sx={{ maxWidth: 160, wordBreak: "break-all" }}>
                      {log.vkPostUrl ? (
                        <a
                          href={log.vkPostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ссылка
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={{ wordBreak: "break-all" }}>
                      {attachmentFromLog(log) ?? "—"}
                    </TableCell>
                    <TableCell>
                      {log.errorMessage
                        ? `${log.errorCode ? `[${log.errorCode}] ` : ""}${log.errorMessage}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
