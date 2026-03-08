import { HTMLAttributes, forwardRef, CSSProperties } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padded = true, style, children, ...props }, ref) => {
    const s: CSSProperties = {
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow-md)",
      ...(padded ? { padding: 24 } : {}),
      ...style,
    };

    return (
      <div ref={ref} style={s} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
