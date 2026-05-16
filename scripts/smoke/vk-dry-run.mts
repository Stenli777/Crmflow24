import { prisma } from "../../src/lib/db/prisma";
import { getVkConfig } from "../../src/lib/vk/config";
import { buildVkPostMessage } from "../../src/lib/vk/buildVkPost";

const post = await prisma.post.findFirst({
  where: { status: "PUBLISHED" },
  orderBy: { updatedAt: "desc" },
});

if (!post) {
  console.error("NO_PUBLISHED_POST");
  process.exit(1);
}

const cfg = getVkConfig();
const message = buildVkPostMessage(post);

await prisma.$transaction([
  prisma.vkPublicationLog.create({
    data: {
      postId: post.id,
      status: "DRY_RUN",
      vkPostId: "dry-run",
      rawResponse: {
        dryRun: true,
        messagePreview: message.slice(0, 200),
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

const updated = await prisma.post.findUnique({
  where: { id: post.id },
  include: {
    vkLogs: { take: 1, orderBy: { createdAt: "desc" } },
  },
});

console.log(
  JSON.stringify(
    {
      dryRun: cfg.dryRun,
      slug: post.slug,
      vkStatus: updated?.vkStatus,
      logStatus: updated?.vkLogs[0]?.status,
      messagePreview: message.slice(0, 120),
    },
    null,
    2,
  ),
);

await prisma.$disconnect();
