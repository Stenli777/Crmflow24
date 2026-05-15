import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required for seed.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      name: "Admin",
      isActive: true,
    },
  });

  console.log(`Admin user is ready: ${email}`);

  const category = await prisma.category.upsert({
    where: { slug: "bitrix24" },
    update: { isActive: true, name: "Битрикс24" },
    create: {
      name: "Битрикс24",
      slug: "bitrix24",
      description:
        "Внедрение, настройка и интеграция Битрикс24 под процессы продаж и сервиса.",
      sortOrder: 0,
      isActive: true,
    },
  });

  const tagCrm = await prisma.tag.upsert({
    where: { slug: "crm" },
    update: { name: "CRM" },
    create: { name: "CRM", slug: "crm" },
  });

  const tagAuto = await prisma.tag.upsert({
    where: { slug: "avtomatizatsiya" },
    update: { name: "Автоматизация" },
    create: { name: "Автоматизация", slug: "avtomatizatsiya" },
  });

  const postSlug = "testovaya-statya-dlya-publichnogo-bloga";
  const publishedAt = new Date("2026-05-15T10:00:00.000Z");

  const contentHtml =
    "<h2>Проверка публичного блога</h2><p>Абзац с <strong>форматированием</strong> и <a target=\"_blank\" rel=\"nofollow noopener noreferrer\" href=\"https://crmflow24.ru\">ссылкой на CRM Flow24</a>.</p><ul><li>пункт списка</li><li>второй пункт</li></ul>";

  const contentJson = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Проверка публичного блога" }],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Абзац с " },
          { type: "text", text: "форматированием", marks: [{ type: "bold" }] },
          { type: "text", text: " и " },
          {
            type: "text",
            text: "ссылкой на CRM Flow24",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "https://crmflow24.ru",
                  target: "_blank",
                  rel: "nofollow noopener noreferrer",
                },
              },
            ],
          },
          { type: "text", text: "." },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "пункт списка" }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "второй пункт" }],
              },
            ],
          },
        ],
      },
    ],
  };

  const post = await prisma.post.upsert({
    where: { slug: postSlug },
    update: {
      status: "PUBLISHED",
      publishedAt,
      title: "Тестовая статья для публичного блога",
      summary:
        "Проверяем публичный вывод статьи, SEO-поля и связанные блоки.",
      seoTitle: "Тестовая статья для публичного блога — CRM Flow24",
      seoDescription:
        "Проверяем публичный блог CRM Flow24, рендер статьи, категории, теги и CTA.",
      contentHtml,
      contentJson,
      categoryId: category.id,
      ctaTitle: "Нужна CRM без хаоса?",
      ctaText:
        "Разберём вашу CRM и предложим план настройки Битрикс24 под ваши процессы.",
      ctaButtonLabel: "Оставить заявку",
      ctaButtonHref: "/contacts",
    },
    create: {
      title: "Тестовая статья для публичного блога",
      slug: postSlug,
      status: "PUBLISHED",
      publishedAt,
      summary:
        "Проверяем публичный вывод статьи, SEO-поля и связанные блоки.",
      seoTitle: "Тестовая статья для публичного блога — CRM Flow24",
      seoDescription:
        "Проверяем публичный блог CRM Flow24, рендер статьи, категории, теги и CTA.",
      contentHtml,
      contentJson,
      categoryId: category.id,
      ctaTitle: "Нужна CRM без хаоса?",
      ctaText:
        "Разберём вашу CRM и предложим план настройки Битрикс24 под ваши процессы.",
      ctaButtonLabel: "Оставить заявку",
      ctaButtonHref: "/contacts",
    },
  });

  await prisma.postTag.deleteMany({ where: { postId: post.id } });
  await prisma.postTag.createMany({
    data: [
      { postId: post.id, tagId: tagCrm.id },
      { postId: post.id, tagId: tagAuto.id },
    ],
  });

  await prisma.postFaqItem.deleteMany({ where: { postId: post.id } });
  await prisma.postFaqItem.create({
    data: {
      postId: post.id,
      question: "Что проверяем?",
      answer: "Публичный вывод статьи и SEO-данные.",
      sortOrder: 0,
    },
  });

  await prisma.postServiceRelation.deleteMany({ where: { postId: post.id } });
  await prisma.postServiceRelation.create({
    data: {
      postId: post.id,
      serviceSlug: "bitrix24",
      title: "Внедрение Битрикс24",
      href: "/services",
      sortOrder: 0,
    },
  });

  console.log(`Blog smoke post is ready: /blog/${postSlug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
