"use client";

import { InputHTMLAttributes, forwardRef, CSSProperties } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  color: "var(--heading)",
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  transition: "all var(--transition)",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--heading)",
  marginBottom: 6,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, style, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div style={{ width: "100%" }}>
        {label && <label htmlFor={inputId} style={labelStyle}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          style={{
            ...inputStyle,
            ...(error ? { borderColor: "var(--error)" } : {}),
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--focus-ring)";
            e.currentTarget.style.borderColor = "var(--primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = error ? "var(--error)" : "var(--border)";
          }}
          {...props}
        />
        {error && (
          <p style={{ marginTop: 4, fontSize: 12, color: "var(--error)" }}>{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
