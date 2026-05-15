import type { PostStatus, RobotsDirective } from "@prisma/client";

const POST_STATUSES: PostStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const ROBOTS: RobotsDirective[] = [
  "INDEX_FOLLOW",
  "INDEX_NOFOLLOW",
  "NOINDEX_FOLLOW",
  "NOINDEX_NOFOLLOW",
];

export function parsePostStatus(value: FormDataEntryValue | null): PostStatus {
  const s = String(value ?? "DRAFT");
  return POST_STATUSES.includes(s as PostStatus) ? (s as PostStatus) : "DRAFT";
}

export function parseRobots(value: FormDataEntryValue | null): RobotsDirective {
  const s = String(value ?? "INDEX_FOLLOW");
  return ROBOTS.includes(s as RobotsDirective)
    ? (s as RobotsDirective)
    : "INDEX_FOLLOW";
}

export function parseOptionalDate(
  value: FormDataEntryValue | null,
): Date | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseTagIds(formData: FormData): string[] {
  return formData
    .getAll("tagIds")
    .map((v) => String(v))
    .filter(Boolean);
}

export function parseRelatedPostIds(formData: FormData): string[] {
  return formData
    .getAll("relatedPostIds")
    .map((v) => String(v))
    .filter(Boolean);
}

export type FaqInput = { question: string; answer: string; sortOrder: number };

export function parseFaqItems(formData: FormData): FaqInput[] {
  const items: FaqInput[] = [];
  for (let i = 0; i < 5; i++) {
    const question = String(formData.get(`faqQuestion_${i}`) ?? "").trim();
    const answer = String(formData.get(`faqAnswer_${i}`) ?? "").trim();
    if (question || answer) {
      if (!question || !answer) {
        throw new Error("FAQ_INCOMPLETE");
      }
      items.push({ question, answer, sortOrder: i });
    }
  }
  return items;
}

export type ServiceInput = {
  serviceSlug: string;
  title: string;
  href: string;
  sortOrder: number;
};

export function parseRelatedServices(formData: FormData): ServiceInput[] {
  const items: ServiceInput[] = [];
  for (let i = 0; i < 5; i++) {
    const serviceSlug = String(formData.get(`serviceSlug_${i}`) ?? "").trim();
    const title = String(formData.get(`serviceTitle_${i}`) ?? "").trim();
    const href = String(formData.get(`serviceHref_${i}`) ?? "").trim();
    if (serviceSlug || title || href) {
      if (!serviceSlug || !title || !href) {
        throw new Error("SERVICE_INCOMPLETE");
      }
      items.push({ serviceSlug, title, href, sortOrder: i });
    }
  }
  return items;
}

export function resolvePublishedAt(
  status: PostStatus,
  publishedAtField: Date | null,
  existingPublishedAt: Date | null,
): Date | null {
  if (status === "PUBLISHED") {
    return publishedAtField ?? existingPublishedAt ?? new Date();
  }
  return publishedAtField;
}
