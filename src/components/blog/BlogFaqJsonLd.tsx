import { jsonLdScriptContent } from "@/lib/jsonLd";

type FaqItem = {
  question: string;
  answer: string;
};

type BlogFaqJsonLdProps = {
  items: FaqItem[];
};

export function BlogFaqJsonLd({ items }: BlogFaqJsonLdProps) {
  const mainEntity = items
    .filter((item) => item.question.trim() && item.answer.trim())
    .map((item) => ({
      "@type": "Question" as const,
      name: item.question.trim(),
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer.trim(),
      },
    }));

  if (mainEntity.length === 0) {
    return null;
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  );
}
