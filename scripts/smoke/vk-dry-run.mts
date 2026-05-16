import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { getVkConfig } = await import("../../src/lib/vk/config");
const { buildVkPostMessage } = await import("../../src/lib/vk/buildVkPost");
const { resolveVkImage } = await import("../../src/lib/vk/resolveVkImage");

const post = await prisma.post.findFirst({
  where: { status: "PUBLISHED" },
  orderBy: { updatedAt: "desc" },
  include: { coverImage: { select: { publicUrl: true, mimeType: true } } },
});

if (!post) {
  console.error("NO_PUBLISHED_POST");
  process.exit(1);
}

const cfg = getVkConfig();
const message = buildVkPostMessage(post);
const resolvedImage = resolveVkImage(post);

await prisma.$transaction([
  prisma.vkPublicationLog.create({
    data: {
      postId: post.id,
      status: "DRY_RUN",
      vkPostId: "dry-run",
      rawResponse: {
        dryRun: true,
        messagePreview: message.slice(0, 200),
        image: resolvedImage
          ? {
              source: resolvedImage.source,
              url: resolvedImage.url,
              attachmentPreview: "photo{owner_id}_{id} (dry-run)",
            }
          : null,
      },
    },
  }),
  prisma.post.update({
    where: { id: post.id },
    data: {
      vkStatus: "DRY_RUN",
      vkPublishedAt: null,
      vkPostUrl: null,
    },
  }),
]);

console.log(
  JSON.stringify(
    {
      dryRun: cfg.dryRun,
      slug: post.slug,
      vkStatus: "DRY_RUN",
      hasImagePreview: Boolean(resolvedImage),
    },
    null,
    2,
  ),
);

await prisma.$disconnect();
