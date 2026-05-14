import { Card, type CardProps } from "@mui/material";
import type { PropsWithChildren } from "react";
import { siteSurfaces } from "@/theme/siteUi";

type CardShellProps = PropsWithChildren<
  CardProps & {
    /** Лёгкий подъём и тень при наведении (сетки карточек) */
    hoverLift?: boolean;
  }
>;

/**
 * Обводная карточка с единым радиусом, рамкой и (опционально) hover-состоянием.
 */
export function CardShell({ children, hoverLift, sx, ...rest }: CardShellProps) {
  return (
    <Card
      variant="outlined"
      {...rest}
      sx={[
        {
          borderRadius: `${siteSurfaces.cardRadiusPx}px`,
          border: siteSurfaces.cardBorder,
          bgcolor: "#ffffff",
          transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
          ...(hoverLift
            ? {
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: siteSurfaces.cardShadowHover,
                  borderColor: "rgba(46,125,255,0.28)",
                },
              }
            : {}),
        },
        ...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
      ]}
    >
      {children}
    </Card>
  );
}
