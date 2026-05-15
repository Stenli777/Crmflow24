import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { prisma } from "@/lib/db/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatAdminDate } from "@/lib/admin/labels";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    where: { type: "IMAGE" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <AdminShell title="Медиа">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Последние загруженные изображения. Загрузка доступна в редакторе статей.
      </Typography>
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Превью</TableCell>
              <TableCell>Файл</TableCell>
              <TableCell>MIME</TableCell>
              <TableCell align="right">Размер</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Создано</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Изображений пока нет
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={asset.publicUrl}
                      alt={asset.alt ?? asset.filename}
                      sx={{
                        width: 72,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: 1,
                        borderColor: "divider",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{asset.filename}</Typography>
                    {asset.originalName ? (
                      <Typography variant="caption" color="text.secondary">
                        {asset.originalName}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>{asset.mimeType}</TableCell>
                  <TableCell align="right">{formatBytes(asset.sizeBytes)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      component="a"
                      href={asset.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {asset.publicUrl}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatAdminDate(asset.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminShell>
  );
}
