"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  Category,
  Post,
  PostFaqItem,
  PostServiceRelation,
  PostStatus,
  RobotsDirective,
  Tag,
  VkPublicationStatus,
} from "@prisma/client";
import type { AdminFormState } from "@/lib/admin/types";
import { createPostAction, updatePostAction } from "@/lib/admin/posts/actions";
import { POST_STATUS_LABELS, VK_STATUS_LABELS } from "@/lib/admin/labels";
import { siteSurfaces } from "@/theme/siteUi";
import { FormAlert } from "./FormAlert";
import {
  TiptapEditor,
  type TiptapEditorHandle,
} from "./editor/TiptapEditor";

type PostWithRelations = Post & {
  tags: { tagId: string }[];
  faqItems: PostFaqItem[];
  relatedServices: PostServiceRelation[];
  relatedFrom: { toPostId: string }[];
};

type PostOption = { id: string; title: string };

type PostFormProps = {
  post?: PostWithRelations;
  categories: Category[];
  tags: Tag[];
  postOptions: PostOption[];
};

const initialState: AdminFormState = {};

const STATUSES: PostStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const ROBOTS: RobotsDirective[] = [
  "INDEX_FOLLOW",
  "INDEX_NOFOLLOW",
  "NOINDEX_FOLLOW",
  "NOINDEX_NOFOLLOW",
];

function toDatetimeLocal(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostForm({
  post,
  categories,
  tags,
  postOptions,
}: PostFormProps) {
  const action = post ? updatePostAction : createPostAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const editorRef = useRef<TiptapEditorHandle>(null);

  const selectedTagIds = new Set(post?.tags.map((t) => t.tagId) ?? []);
  const selectedRelated = new Set(
    post?.relatedFrom.map((r) => r.toPostId) ?? [],
  );

  const faqByIndex = (i: number) =>
    post?.faqItems.find((f) => f.sortOrder === i);

  const serviceByIndex = (i: number) =>
    post?.relatedServices.find((s) => s.sortOrder === i);

  return (
    <Paper
      component="form"
      action={formAction}
      onSubmit={() => {
        editorRef.current?.syncToFormFields();
      }}
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: `${siteSurfaces.cardRadiusPx}px`,
        border: siteSurfaces.cardBorder,
        boxShadow: siteSurfaces.cardShadowSoft,
      }}
    >
      <FormAlert state={state} />
      <Stack spacing={3}>
        {post ? <input type="hidden" name="id" value={post.id} /> : null}

        <Box>
          <Typography variant="h6" gutterBottom>
            Основное
          </Typography>
          <Stack spacing={2}>
            <TextField name="title" label="Заголовок" required defaultValue={post?.title ?? ""} fullWidth />
            <TextField
              name="slug"
              label="Slug"
              helperText="Пустой — автогенерация из заголовка"
              defaultValue={post?.slug ?? ""}
              fullWidth
            />
            <TextField name="summary" label="Краткое описание" multiline minRows={2} defaultValue={post?.summary ?? ""} fullWidth />
            <TextField name="excerpt" label="Выдержка" multiline minRows={2} defaultValue={post?.excerpt ?? ""} fullWidth />
            <FormControl fullWidth>
              <InputLabel id="status-label">Статус</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                label="Статус"
                defaultValue={post?.status ?? "DRAFT"}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {POST_STATUS_LABELS[s]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="publishedAt"
              label="Дата публикации"
              type="datetime-local"
              defaultValue={toDatetimeLocal(post?.publishedAt)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <FormControl fullWidth>
              <InputLabel id="category-label">Категория</InputLabel>
              <Select
                labelId="category-label"
                name="categoryId"
                label="Категория"
                defaultValue={post?.categoryId ?? ""}
              >
                <MenuItem value="">— без категории —</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Теги</FormLabel>
              <FormGroup row sx={{ flexWrap: "wrap" }}>
                {tags.map((tag) => (
                  <FormControlLabel
                    key={tag.id}
                    control={
                      <Checkbox
                        name="tagIds"
                        value={tag.id}
                        defaultChecked={selectedTagIds.has(tag.id)}
                      />
                    }
                    label={tag.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <TiptapEditor
              ref={editorRef}
              initialContentJson={post?.contentJson}
              initialContentHtml={post?.contentHtml}
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            SEO
          </Typography>
          <Stack spacing={2}>
            <TextField name="seoTitle" label="SEO title" defaultValue={post?.seoTitle ?? ""} fullWidth />
            <TextField name="seoDescription" label="SEO description" multiline minRows={2} defaultValue={post?.seoDescription ?? ""} fullWidth />
            <TextField name="seoKeywords" label="SEO keywords" defaultValue={post?.seoKeywords ?? ""} fullWidth />
            <TextField name="canonicalUrl" label="Canonical URL" defaultValue={post?.canonicalUrl ?? ""} fullWidth />
            <FormControl fullWidth>
              <InputLabel id="robots-label">Robots</InputLabel>
              <Select
                labelId="robots-label"
                name="robotsDirective"
                label="Robots"
                defaultValue={post?.robotsDirective ?? "INDEX_FOLLOW"}
              >
                {ROBOTS.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            Open Graph
          </Typography>
          <Stack spacing={2}>
            <TextField name="ogTitle" label="OG title" defaultValue={post?.ogTitle ?? ""} fullWidth />
            <TextField name="ogDescription" label="OG description" multiline minRows={2} defaultValue={post?.ogDescription ?? ""} fullWidth />
            <TextField name="ogImageUrl" label="OG image URL" defaultValue={post?.ogImageUrl ?? ""} fullWidth />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            Schema
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="schema-label">Тип schema</InputLabel>
            <Select
              labelId="schema-label"
              name="schemaType"
              label="Тип schema"
              defaultValue={post?.schemaType ?? "BlogPosting"}
            >
              <MenuItem value="BlogPosting">BlogPosting</MenuItem>
              <MenuItem value="Article">Article</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            CTA
          </Typography>
          <Stack spacing={2}>
            <TextField name="ctaTitle" label="CTA заголовок" defaultValue={post?.ctaTitle ?? ""} fullWidth />
            <TextField name="ctaText" label="CTA текст" multiline minRows={2} defaultValue={post?.ctaText ?? ""} fullWidth />
            <TextField name="ctaButtonLabel" label="Текст кнопки" defaultValue={post?.ctaButtonLabel ?? ""} fullWidth />
            <TextField name="ctaButtonHref" label="Ссылка кнопки" defaultValue={post?.ctaButtonHref ?? ""} fullWidth />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            ВКонтакте
          </Typography>
          <Stack spacing={2}>
            <TextField name="vkText" label="Текст для VK" multiline minRows={3} defaultValue={post?.vkText ?? ""} fullWidth />
            {post ? (
              <>
                <TextField
                  label="Статус VK"
                  value={VK_STATUS_LABELS[post.vkStatus as VkPublicationStatus]}
                  fullWidth
                  slotProps={{ htmlInput: { readOnly: true } }}
                />
                {post.vkPostUrl ? (
                  <TextField
                    label="URL поста VK"
                    value={post.vkPostUrl}
                    fullWidth
                    slotProps={{ htmlInput: { readOnly: true } }}
                  />
                ) : null}
                {post.vkPublishedAt ? (
                  <TextField
                    label="Опубликовано в VK"
                    value={toDatetimeLocal(post.vkPublishedAt)}
                    fullWidth
                    slotProps={{ htmlInput: { readOnly: true } }}
                  />
                ) : null}
              </>
            ) : null}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            FAQ (до 5 блоков)
          </Typography>
          <Stack spacing={2}>
            {Array.from({ length: 5 }, (_, i) => {
              const faq = faqByIndex(i);
              return (
                <Stack key={i} spacing={1} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="subtitle2">Блок {i + 1}</Typography>
                  <TextField name={`faqQuestion_${i}`} label="Вопрос" defaultValue={faq?.question ?? ""} fullWidth />
                  <TextField name={`faqAnswer_${i}`} label="Ответ" multiline minRows={2} defaultValue={faq?.answer ?? ""} fullWidth />
                </Stack>
              );
            })}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            Связанные услуги (до 5)
          </Typography>
          <Stack spacing={2}>
            {Array.from({ length: 5 }, (_, i) => {
              const svc = serviceByIndex(i);
              return (
                <Stack key={i} spacing={1} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="subtitle2">Услуга {i + 1}</Typography>
                  <TextField name={`serviceSlug_${i}`} label="Slug услуги" defaultValue={svc?.serviceSlug ?? ""} fullWidth />
                  <TextField name={`serviceTitle_${i}`} label="Название" defaultValue={svc?.title ?? ""} fullWidth />
                  <TextField name={`serviceHref_${i}`} label="Ссылка" defaultValue={svc?.href ?? ""} fullWidth />
                </Stack>
              );
            })}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            Связанные статьи
          </Typography>
          {postOptions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Нет других статей для связи.
            </Typography>
          ) : (
            <FormGroup>
              {postOptions.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  control={
                    <Checkbox
                      name="relatedPostIds"
                      value={opt.id}
                      defaultChecked={selectedRelated.has(opt.id)}
                    />
                  }
                  label={opt.title}
                />
              ))}
            </FormGroup>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? "Сохранение…" : "Сохранить"}
          </Button>
          <Button component={Link} href="/admin/posts" variant="outlined" color="inherit">
            Назад
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
