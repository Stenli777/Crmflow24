import { faqs } from "@/content/site-content";
import { buildFaqPageJsonLd, jsonLdScriptContent } from "@/lib/jsonLd";

/** FAQPage для блока «Частые вопросы» на главной (расширенные сниппеты). */
export function FaqJsonLd() {
  const data = buildFaqPageJsonLd(faqs);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  );
}
