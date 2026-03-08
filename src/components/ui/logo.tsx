import Link from "next/link";
import { CSSProperties } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkTo?: string;
}

const fontSizes = { sm: 16, md: 20, lg: 26 };

export function Logo({ size = "md", linkTo = "/" }: LogoProps) {
  const s: CSSProperties = {
    fontSize: fontSizes[size],
    fontWeight: 700,
    color: "var(--heading)",
    letterSpacing: "-0.02em",
    textDecoration: "none",
  };

  if (linkTo) {
    return <Link href={linkTo} style={s}>chatterbox</Link>;
  }

  return <span style={s}>chatterbox</span>;
}
