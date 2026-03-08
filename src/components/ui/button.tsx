"use client";

import { ButtonHTMLAttributes, forwardRef, CSSProperties } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  borderRadius: "var(--radius)",
  border: "1px solid transparent",
  cursor: "pointer",
  transition: "all var(--transition)",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const variantMap: Record<Variant, CSSProperties> = {
  primary: { backgroundColor: "var(--primary)", color: "#fff" },
  secondary: { backgroundColor: "var(--surface)", color: "var(--heading)", borderColor: "var(--border)" },
  ghost: { backgroundColor: "transparent", color: "var(--body)" },
  danger: { backgroundColor: "var(--error)", color: "#fff" },
};

const hoverBg: Record<Variant, string> = {
  primary: "var(--primary-hover)",
  secondary: "var(--bg)",
  ghost: "var(--bg)",
  danger: "#d25a5a",
};

const sizeMap: Record<Size, CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: 13 },
  md: { padding: "8px 16px", fontSize: 14 },
  lg: { padding: "10px 24px", fontSize: 15 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, style, children, disabled, ...props }, ref) => {
    const s: CSSProperties = {
      ...base,
      ...variantMap[variant],
      ...sizeMap[size],
      ...(fullWidth ? { width: "100%" } : {}),
      ...(disabled || loading ? { opacity: 0.5, cursor: "not-allowed" } : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={s}
        onMouseEnter={(e) => {
          if (disabled || loading) return;
          e.currentTarget.style.backgroundColor = hoverBg[variant];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = (variantMap[variant].backgroundColor as string) || "transparent";
        }}
        {...props}
      >
        {loading && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8, animation: "spin 1s linear infinite" }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity={0.25} />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity={0.75} />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
