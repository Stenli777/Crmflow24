import { Stack, Typography } from "@mui/material";

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <Stack spacing={1.25}>
      <Typography variant="h2" sx={{ maxWidth: 920 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 860, lineHeight: 1.65 }}>
        {subtitle}
      </Typography>
    </Stack>
  );
}

