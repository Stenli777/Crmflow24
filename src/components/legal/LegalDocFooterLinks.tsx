import { Box, Typography } from "@mui/material";
import Link from "next/link";

const links: Array<{ href: string; label: string }> = [
  { href: "/privacy", label: "Политика ПДн" },
  { href: "/cookies", label: "Политика cookie" },
  { href: "/consent", label: "Согласие на обработку ПДн" },
  { href: "/marketing-consent", label: "Согласие на рекламные рассылки" },
  { href: "/terms", label: "Пользовательское соглашение" },
];

export function LegalDocFooterLinks() {
  return (
    <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider", maxWidth: 900 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
        Связанные документы
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 2, rowGap: 1 }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} style={{ fontWeight: 600 }}>
            {l.label}
          </Link>
        ))}
      </Box>
    </Box>
  );
}
