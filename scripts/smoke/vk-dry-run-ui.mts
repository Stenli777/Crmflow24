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
    if (!(key in process.env)) {
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

const post = await prisma.post.findFirst({
  where: { status: PostStatus.PUBLISHED },
  orderBy: { updatedAt: "desc" },
});

if (!post) {
  console.error("NO_PUBLISHED_POST");
  process.exit(1);
}

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
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);

  await page.goto(`${baseUrl}/admin/posts/${post.id}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);
  await page.getByRole("heading", { name: "Публикация во ВКонтакте" }).waitFor({
    timeout: 30000,
  });
  await page.keyboard.press("Escape").catch(() => {});

  const vkText = `VK UI smoke ${new Date().toISOString()}`;
  const postForm = page.locator("form").filter({
    has: page.getByLabel("Текст для VK"),
  });
  await postForm.getByLabel("Текст для VK").fill(vkText);
  await postForm.locator("button").filter({ hasText: "Сохранить" }).click();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

  await page
    .getByRole("button", {
      name: /Проверить VK публикацию|Опубликовать во ВКонтакте/,
    })
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

  console.log(
    JSON.stringify(
      {
        ok:
          statusVisible &&
          logTable &&
          updated?.vkStatus === "DRY_RUN" &&
          updated.vkLogs[0]?.status === "DRY_RUN",
        statusVisible,
        logTable,
        vkStatus: updated?.vkStatus,
        logStatus: updated?.vkLogs[0]?.status,
        url: page.url(),
      },
      null,
      2,
    ),
  );

  if (
    !statusVisible ||
    !logTable ||
    updated?.vkStatus !== "DRY_RUN"
  ) {
    process.exit(1);
  }
} finally {
  await browser.close();
  await prisma.$disconnect();
}
