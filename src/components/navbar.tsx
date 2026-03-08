"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useState, CSSProperties } from "react";

const navLinks = [{ href: "/pricing", label: "Pricing" }];

const navStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  backgroundColor: "var(--surface)",
  borderBottom: "1px solid var(--border)",
};

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="hide-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: pathname === link.href ? "var(--heading)" : "var(--body)",
                  transition: "color var(--transition)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hide-mobile">
          <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link href="/signup"><Button size="sm">Get Started</Button></Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="show-mobile-only"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "var(--body)",
            fontSize: 24,
            lineHeight: 1,
          }}
        >
          {mobileOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="show-mobile-only"
          style={{
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 14, fontWeight: 500, color: "var(--body)", textDecoration: "none", padding: "4px 0" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="secondary" fullWidth>Log in</Button></Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}><Button fullWidth>Get Started</Button></Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .show-mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .show-mobile-only { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
