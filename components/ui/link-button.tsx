"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "@heroui/react";

interface LinkButtonProps extends Omit<ButtonProps, "as" | "href"> {
  href: string;
}

/**
 * A client-side wrapper so server components (page.tsx) can render
 * a HeroUI Button that navigates via next/link without needing "use client"
 * on the page itself.
 */
export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button as={Link} href={href} {...props}>
      {children}
    </Button>
  );
}
