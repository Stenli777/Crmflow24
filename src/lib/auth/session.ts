import type { AdminUser } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_SESSION_MAX_AGE_SECONDS } from "./constants";
import { createSessionToken, hashSessionToken } from "./crypto";

export async function createAdminSession(adminUserId: string): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(
    Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
  );

  await prisma.adminSession.create({
    data: {
      tokenHash,
      adminUserId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getAdminBySessionToken(
  token: string,
): Promise<AdminUser | null> {
  const tokenHash = hashSessionToken(token);
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { adminUser: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    return null;
  }

  const { adminUser } = session;

  if (!adminUser.isActive) {
    return null;
  }

  return adminUser;
}

export async function deleteAdminSessionByToken(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);

  await prisma.adminSession.deleteMany({
    where: { tokenHash },
  });
}

export async function deleteExpiredAdminSessions(): Promise<void> {
  await prisma.adminSession.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}
