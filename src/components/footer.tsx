import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
  Product: [
    { href: "/pricing", label: "Pricing" },
    { href: "#", label: "Features" },
    { href: "#", label: "Integrations" },
    { href: "#", label: "Changelog" },
  ],
  Company: [
    { href: "#", label: "About" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Contact" },
  ],
  Legal: [
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
    { href: "#", label: "Security" },
  ],
};

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }} className="footer-grid">
          <div>
            <Logo size="sm" />
            <p style={{ marginTop: 12, fontSize: 13, color: "var(--body-light)", lineHeight: 1.6, maxWidth: 240 }}>
              The communications platform for everything important.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--heading)", marginBottom: 12 }}>
                {category}
              </h4>
              <ul style={{ listStyle: "none" }}>
                {links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 8 }}>
                    <Link
                      href={link.href}
                      style={{ fontSize: 13, color: "var(--body-light)", textDecoration: "none", transition: "color var(--transition)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--body-light)" }}>
            &copy; {new Date().getFullYear()} Chatterbox. All rights reserved.
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  );
}
