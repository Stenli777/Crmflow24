import type { Metadata } from "next";
import type { RobotsDirective } from "@prisma/client";

export function robotsDirectiveToMetadata(
  directive: RobotsDirective,
): NonNullable<Metadata["robots"]> {
  switch (directive) {
    case "INDEX_FOLLOW":
      return { index: true, follow: true };
    case "INDEX_NOFOLLOW":
      return { index: true, follow: false };
    case "NOINDEX_FOLLOW":
      return { index: false, follow: true };
    case "NOINDEX_NOFOLLOW":
      return { index: false, follow: false };
    default:
      return { index: true, follow: true };
  }
}
