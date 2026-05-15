import type { AdminUser } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAdminSessionCookie } from "./cookies";
import { getAdminBySessionToken } from "./session";

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = await getAdminSessionCookie();

  if (!token) {
    return null;
  }

  return getAdminBySessionToken(token);
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
