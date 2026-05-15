"use client";

import Link from "next/link";
import Button, { type ButtonProps } from "@mui/material/Button";

export type ButtonLinkProps = Omit<ButtonProps, "href"> & {
  href: string;
};

export function ButtonLink({ href, children, ...props }: ButtonLinkProps) {
  return (
    <Button {...props} sx={{ textDecoration: "none", ...props.sx }}>
      <Link href={href} style={{ color: "inherit", textDecoration: "none" }}>
        {children}
      </Link>
    </Button>
  );
}
