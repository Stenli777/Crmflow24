import { Box, Typography } from "@mui/material";
import { siteLayout } from "@/theme/siteUi";

type BlogArticleContentProps = {
  html: string | null;
};

/**
 * HTML контента статьи. Санитизация выполняется server-side при сохранении
 * в src/lib/admin/posts/sanitize.ts — здесь только вывод уже очищённого contentHtml.
 */
export function BlogArticleContent({ html }: BlogArticleContentProps) {
  if (!html?.trim()) {
    return (
      <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
        Текст статьи появится позже.
      </Typography>
    );
  }

  return (
    <Box
      component="div"
      className="blog-article-content"
      sx={{
        maxWidth: siteLayout.articleMaxPx,
        lineHeight: 1.7,
        "& p": { my: 1.5 },
        "& h2": { mt: 3, mb: 1.5, fontSize: "1.5rem", fontWeight: 700 },
        "& h3": { mt: 2.5, mb: 1.25, fontSize: "1.25rem", fontWeight: 700 },
        "& h4": { mt: 2, mb: 1, fontSize: "1.125rem", fontWeight: 600 },
        "& ul, & ol": { pl: 3, my: 1.5 },
        "& li": { my: 0.5 },
        "& blockquote": {
          my: 2,
          pl: 2,
          borderLeft: 3,
          borderColor: "divider",
          color: "text.secondary",
        },
        "& img": {
          maxWidth: "100%",
          height: "auto",
          borderRadius: 2,
          my: 2,
          display: "block",
        },
        "& a": {
          color: "primary.main",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
