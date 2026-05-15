import type { MetadataRoute } from "next";
import { isIndexableEnvironment } from "@/lib/seo/deployEnvironment";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexableEnvironment()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.siteDomain,
  };
}
