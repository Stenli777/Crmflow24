import type { ReactNode } from "react";
import Link from "next/link";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { formatAdminDate } from "@/lib/admin/labels";
import type { ScrapImportDetail } from "@/lib/scrap/admin";
import {
  formatEditorialPreview,
  formatLastPayloadPreview,
  scrapExternalId,
} from "@/lib/scrap/admin";
import { siteSurfaces } from "@/theme/siteUi";

type ScrapImportPanelProps = {
  scrapImport: ScrapImportDetail;
};

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <TableRow>
      <TableCell
        component="th"
        scope="row"
        sx={{ width: "38%", fontWeight: 600, verticalAlign: "top" }}
      >
        {label}
      </TableCell>
      <TableCell sx={{ wordBreak: "break-word" }}>{children}</TableCell>
    </TableRow>
  );
}

export function ScrapImportPanel({ scrapImport }: ScrapImportPanelProps) {
  const externalId = scrapExternalId(
    scrapImport.documentId,
    scrapImport.revisionId,
  );
  const editorial = formatEditorialPreview(scrapImport.editorialJson);
  const payloadText = formatLastPayloadPreview(scrapImport.lastPayload);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mt: 3,
        border: siteSurfaces.cardBorder,
        borderRadius: `${siteSurfaces.cardRadiusPx}px`,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
        <Typography variant="h6" component="h2">
          Scrap import
        </Typography>
        <Chip size="small" label="Scrap" color="info" variant="outlined" />
        <Chip
          size="small"
          label={scrapImport.remoteStatus}
          variant="outlined"
        />
      </Stack>

      <Table size="small">
        <TableBody>
          <MetaRow label="provider">{scrapImport.provider}</MetaRow>
          <MetaRow label="documentId">{scrapImport.documentId}</MetaRow>
          <MetaRow label="revisionId">{scrapImport.revisionId}</MetaRow>
          <MetaRow label="external_id">
            <Typography component="code" variant="body2" sx={{ fontSize: "0.85rem" }}>
              {externalId}
            </Typography>
          </MetaRow>
          <MetaRow label="sourceUrl">
            {scrapImport.sourceUrl ? (
              <Link href={scrapImport.sourceUrl} target="_blank" rel="noopener noreferrer">
                {scrapImport.sourceUrl}
              </Link>
            ) : (
              "—"
            )}
          </MetaRow>
          <MetaRow label="sourceDomain">
            {scrapImport.sourceDomain ?? "—"}
          </MetaRow>
          <MetaRow label="scrapedAt">
            {formatAdminDate(scrapImport.scrapedAt)}
          </MetaRow>
          <MetaRow label="payloadVersion">
            {scrapImport.payloadVersion}
          </MetaRow>
          <MetaRow label="remoteStatus">{scrapImport.remoteStatus}</MetaRow>
          <MetaRow label="importedAt">
            {formatAdminDate(scrapImport.importedAt)}
          </MetaRow>
          <MetaRow label="updatedAt">
            {formatAdminDate(scrapImport.updatedAt)}
          </MetaRow>
          <MetaRow label="editorialJson">
            {editorial.kind === "empty" ? (
              "—"
            ) : editorial.kind === "fields" ? (
              <Stack component="span" spacing={0.25}>
                {editorial.lines.map((line) => (
                  <Typography
                    key={line}
                    variant="body2"
                    component="div"
                    sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                  >
                    {line}
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 1,
                  maxHeight: 160,
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: "0.75rem",
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
              >
                {editorial.text}
              </Box>
            )}
          </MetaRow>
        </TableBody>
      </Table>

      <Box sx={{ mt: 2 }}>
        <details>
          <summary>
            <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
              lastPayload (raw)
            </Typography>
          </summary>
          <Box
            component="pre"
            sx={{
              mt: 1,
              mb: 0,
              p: 1.5,
              maxHeight: 280,
              maxWidth: "100%",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: "0.75rem",
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          >
            {payloadText}
          </Box>
        </details>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
        Только для админки. На публичном сайте эти данные не отображаются.
      </Typography>
    </Paper>
  );
}
