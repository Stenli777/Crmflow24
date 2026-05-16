/**
 * UI smoke: VK dry-run из админки.
 * Запуск: npm run dev, затем npx tsx scripts/smoke/vk-dry-run-ui.mts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PrismaClient, PostStatus } from "@prisma/client";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function loadEnvFile(filePath: string) {
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(rootDir, ".env"));

const prisma = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD required in .env");
  process.exit(1);
}

let post = await prisma.post.findFirst({
  where: { status: PostStatus.PUBLISHED },
  orderBy: { updatedAt: "desc" },
});

if (!post) {
  console.error("NO_PUBLISHED_POST");
  process.exit(1);
}

// Для проверки image preview в dry-run (этап 9)
post = await prisma.post.update({
  where: { id: post.id },
  data: {
    ogImageUrl: "/images/logo.png",
    vkStatus: "NOT_PUBLISHED",
    vkPostUrl: null,
    vkPublishedAt: null,
  },
});

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.addInitScript(() => {
  localStorage.setItem(
    "crmflow24_cookie_consent_v1",
    JSON.stringify({
      version: 1,
      choice: "necessary",
      analytics: false,
      updatedAt: new Date().toISOString(),
    }),
  );
});
const page = await context.newPage();

try {
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: "domcontentloaded" });
  await page.locator('input[name="email"]').waitFor({ timeout: 20000 });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await Promise.all([
    page.waitForURL(
      (url) =>
        url.pathname.startsWith("/admin") &&
        !url.pathname.startsWith("/admin/login"),
      { timeout: 60000 },
    ),
    page.locator('button[type="submit"]').click(),
  ]);

  await page.goto(`${baseUrl}/admin/posts/${post.id}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("heading", { name: "Публикация во ВКонтакте" }).waitFor({
    timeout: 60000,
  });

  await page
    .getByRole("button", { name: /Проверить VK публикацию/ })
    .click();

  await page
    .getByText(/Проверка VK \(dry-run\)/i)
    .waitFor({ timeout: 20000 });

  const updated = await prisma.post.findUnique({
    where: { id: post.id },
    include: {
      vkLogs: { take: 1, orderBy: { createdAt: "desc" } },
    },
  });

  const statusVisible = await page
    .getByText("Проверка (dry-run)")
    .first()
    .isVisible();
  const logTable = await page.getByText("Последние попытки").isVisible();
  const imageBlockVisible = await page
    .getByText("Изображение для VK")
    .isVisible();
  const imageSourceVisible = await page
    .getByText("Источник: OG image")
    .isVisible();

  const raw = updated?.vkLogs[0]?.rawResponse as {
    dryRun?: boolean;
    image?: { attachmentPreview?: string; url?: string };
  } | null;
  const hasAttachmentPreview = Boolean(
    raw?.image?.attachmentPreview?.includes("dry-run"),
  );
  const hasImageUrl = Boolean(raw?.image?.url);

  const ok =
    statusVisible &&
    logTable &&
    imageBlockVisible &&
    imageSourceVisible &&
    updated?.vkStatus === "DRY_RUN" &&
    updated.vkLogs[0]?.status === "DRY_RUN" &&
    hasAttachmentPreview &&
    hasImageUrl;

  console.log(
    JSON.stringify(
      {
        ok,
        statusVisible,
        logTable,
        imageBlockVisible,
        imageSourceVisible,
        vkStatus: updated?.vkStatus,
        logStatus: updated?.vkLogs[0]?.status,
        hasAttachmentPreview,
        hasImageUrl,
        attachmentPreview: raw?.image?.attachmentPreview ?? null,
        url: page.url(),
      },
      null,
      2,
    ),
  );

  if (!ok) {
    process.exit(1);
  }
} finally {
  await browser.close();
  await prisma.$disconnect();
}
