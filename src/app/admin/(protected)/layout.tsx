import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProtectedLayout({
  children,
}: PropsWithChildren) {
  await requireAdmin();
  return children;
}
