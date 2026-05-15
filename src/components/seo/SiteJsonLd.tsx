import { headers } from "next/headers";
import {
  breadcrumbPageTitles,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  jsonLdScriptContent,
} from "@/lib/jsonLd";

/** Organization (+ BreadcrumbList на внутренних страницах с известным путём). */
export async function SiteJsonLd() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";

  const blocks: { key: string; data: unknown }[] = [
    { key: "ld-organization", data: buildOrganizationJsonLd() },
    { key: "ld-website", data: buildWebSiteJsonLd() },
  ];

  if (pathname && pathname !== "/") {
    const title = breadcrumbPageTitles[pathname];
    if (title) {
      blocks.push({
        key: "ld-breadcrumb",
        data: buildBreadcrumbJsonLd(pathname, title),
      });
    }
  }

  return (
    <>
      {blocks.map(({ key, data }) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
        />
      ))}
    </>
  );
}
