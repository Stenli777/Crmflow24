import { Box, Chip, Stack, Typography } from "@mui/material";
import type { CaseItem } from "@/content/site-content";

function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ pl: 2.5, m: 0, color: "text.secondary" }}>
      {items.map((line) => (
        <li key={line}>
          <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {line}
          </Typography>
        </li>
      ))}
    </Box>
  );
}

export function CaseStudyBody({
  item,
  dense,
  showSummary = true,
}: {
  item: CaseItem;
  dense?: boolean;
  showSummary?: boolean;
}) {
  const spacing = dense ? 1.2 : 1.75;
  return (
    <Stack spacing={spacing}>
      {showSummary ? (
        <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {item.summary}
        </Typography>
      ) : null}
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
        {item.tags.map((tag) => (
          <Chip key={tag} size="small" label={tag} color="primary" variant="outlined" />
        ))}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Ключевые факты</Typography>
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {item.facts.map((fact) => (
            <Chip key={fact} size="small" variant="filled" color="default" label={fact} sx={{ bgcolor: "action.hover" }} />
          ))}
        </Box>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Задача</Typography>
        <BulletList items={item.problem} />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Что сделали</Typography>
        <BulletList items={item.solution} />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Результат</Typography>
        <BulletList items={item.result} />
      </Box>
    </Stack>
  );
}
