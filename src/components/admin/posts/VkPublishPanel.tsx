"use client";

import { useActionState } from "react";
import {
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
  type Post,
  type VkPublicationLog,
  type VkPublicationStatus,
} from "@prisma/client";
import { publishPostToVkAction } from "@/lib/admin/posts/vkActions";
import { VK_STATUS_LABELS, formatAdminDate } from "@/lib/admin/labels";
import type { AdminFormState } from "@/lib/admin/types";
import { siteSurfaces } from "@/theme/siteUi";
import { FormAlert } from "../FormAlert";

type VkPublishPanelProps = {
  post: Pick<
    Post,
    "id" | "status" | "vkStatus" | "vkPostUrl" | "vkPublishedAt" | "vkText"
  >;
  logs: VkPublicationLog[];
  dryRun: boolean;
};

const initialState: AdminFormState = {};

export function VkPublishPanel({ post, logs, dryRun }: VkPublishPanelProps) {
  const [state, formAction, pending] = useActionState(
    publishPostToVkAction,
    initialState,
  );

  const isPublished = post.status === PostStatus.PUBLISHED;
  const buttonLabel = dryRun
    ? "Проверить VK публикацию (dry-run)"
    : "Опубликовать во ВКонтакте";

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
          Текст для VK редактируется в форме статьи выше.{" "}
          {dryRun
            ? "Сейчас включён dry-run: реальный API не вызывается."
            : "Режим реальной публикации (VK_DRY_RUN=false)."}
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Статус VK
            </Typography>
            <Typography variant="body1">
              {VK_STATUS_LABELS[post.vkStatus as VkPublicationStatus]}
            </Typography>
          </Box>
          {post.vkPostUrl ? (
            <Box>
              <Typography variant="caption" color="text.secondary">
                URL поста
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
                Опубликовано в VK
              </Typography>
              <Typography variant="body1">
                {formatAdminDate(post.vkPublishedAt)}
              </Typography>
            </Box>
          ) : null}
        </Stack>

        {isPublished ? (
          <form action={formAction}>
            <input type="hidden" name="postId" value={post.id} />
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? "Отправка…" : buttonLabel}
            </Button>
          </form>
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
                  <TableCell>Код</TableCell>
                  <TableCell>Ошибка</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatAdminDate(log.createdAt)}</TableCell>
                    <TableCell>
                      {VK_STATUS_LABELS[log.status as VkPublicationStatus]}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, wordBreak: "break-all" }}>
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
                    <TableCell>{log.errorCode ?? "—"}</TableCell>
                    <TableCell>{log.errorMessage ?? "—"}</TableCell>
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
