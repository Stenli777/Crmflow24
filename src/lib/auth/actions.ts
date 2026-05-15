"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import {
  clearAdminSessionCookie,
  getAdminSessionCookie,
  setAdminSessionCookie,
} from "./cookies";
import { createAdminSession, deleteAdminSessionByToken } from "./session";

export type LoginAdminState = {
  error?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function loginAdminAction(
  _prevState: LoginAdminState,
  formData: FormData,
): Promise<LoginAdminState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Неверный email или пароль" };
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!adminUser || !adminUser.isActive) {
    return { error: "Неверный email или пароль" };
  }

  const passwordValid = await bcrypt.compare(password, adminUser.passwordHash);

  if (!passwordValid) {
    return { error: "Неверный email или пароль" };
  }

  const { token, expiresAt } = await createAdminSession(adminUser.id);
  await setAdminSessionCookie(token, expiresAt);

  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  const token = await getAdminSessionCookie();

  if (token) {
    await deleteAdminSessionByToken(token);
  }

  await clearAdminSessionCookie();
  redirect("/admin/login");
}
