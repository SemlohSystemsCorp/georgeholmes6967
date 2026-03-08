import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CSSProperties } from "react";

const section: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const center: CSSProperties = { textAlign: "center" };
const sectionBorder: CSSProperties = { borderTop: "1px solid var(--border)" };

const features = [
  { title: "Real-Time Messaging", desc: "Instant messaging with channels, threads, and DMs. Every conversation stays organized and searchable." },
  { title: "Enterprise Security", desc: "End-to-end encryption, SSO, RBAC, and audit logs. Your data stays protected at every level." },
  { title: "Powerful Integrations", desc: "Connect GitHub, Stripe, Jira, and 100+ tools. Everything flows into one place." },
  { title: "Team Management", desc: "Custom roles, permissions, and team structures. Scale from 5 people to 5,000 without friction." },
  { title: "Compliance Ready", desc: "SOC 2, GDPR, and HIPAA compliant. Built for organizations with strict regulatory requirements." },
  { title: "Global Infrastructure", desc: "Deployed across multiple regions with 99.99% uptime. Fast for every team, everywhere." },
];

const stats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<50ms", label: "Message latency" },
  { value: "10M+", label: "Messages daily" },
  { value: "256-bit", label: "AES encryption" },
];

const trustedLogos = [
  { name: "Vercel", src: "/vercel-icon.svg" },
  { name: "GitHub", src: "/github.svg" },
  { name: "Stripe", src: null, svg: `<svg viewBox="0 0 60 25" fill="currentColor"><path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a13.4 13.4 0 0 1-4.56.75c-4.14 0-6.95-2.1-6.95-6.86 0-3.57 2.28-6.86 6.3-6.86 3.45 0 5.98 2.28 5.98 6.48.04.56.04 1.01.04 1.57zm-8.1-2.36h4.38c0-1.73-.82-2.85-2.17-2.85-1.25 0-2.08 1.01-2.21 2.85zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V6.57h3.5l.26 1.15A4.7 4.7 0 0 1 41.2 6.3c2.8 0 5.28 2.51 5.28 6.92 0 4.82-2.44 7.08-5.53 7.08zm-.6-10.56c-.97 0-1.63.35-2.11.88l.04 5.45c.44.5 1.11.86 2.07.86 1.56 0 2.62-1.66 2.62-3.62 0-1.96-1.02-3.57-2.62-3.57zm-9.4-3.17v13.73h-4.12V6.57h4.12zm0-4.7L26.83 2.8v3.4h4.12V2.57zM23.55 6.57l.26 1.37c.78-1.08 2.02-1.64 3.24-1.64l-.69 3.97c-1.33-.26-2.36.08-3.01.71v9.32h-4.12V6.57h4.32zm-8.63 0h2.55v3.33h-2.55V14c0 1.5.97 1.73 2.28 1.44v3.5c-.6.22-1.5.37-2.78.37-2.47 0-3.62-1.5-3.62-3.87V9.9h-1.92V6.57h.52c1.5 0 2.24-.71 2.24-2.1V2.35h3.28v4.22zM4.17 16.42c1.33 0 2.36-.45 2.36-1.44 0-2.92-7.54-1.37-7.54-7.15C-1.01 4.72 1.74 3 5.22 3c1.92 0 3.87.49 5.31 1.52l-1.5 3.13c-1.22-.82-2.66-1.19-3.77-1.19-1.18 0-1.92.37-1.92 1.22 0 2.7 7.54 1.15 7.54 7.04 0 3.35-2.81 5.58-6.55 5.58-2.32 0-4.68-.71-6.07-1.96l1.63-3.2c1.22 1.12 3.2 2.28 4.28 2.28z"/></svg>` },
  { name: "Linear", src: null, svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M1.22541 61.5228c-.97401-1.6673-.11257-3.3346 1.09746-4.5446L47.3192 12.0313c1.2101-1.21 2.8774-2.0714 4.5447-1.0975 24.0137 14.0068 32.0182 45.1782 18.0114 69.192C55.869 104.14 24.6976 112.144 .695508 98.1373c-1.667283-.9741-2.071443-2.6414-1.097468-4.5447l17.64656-30.0698c.97397-1.6674 2.64137-2.0716 4.54477-1.0976 4.7634 2.7864 10.8657 1.1191 13.6521-3.6443 2.7864-4.7634 1.1191-10.8656-3.6443-13.652-4.7634-2.7865-10.8657-1.1192-13.6521 3.6443L.097942 79.043c-.974-1.6674-2.07144-2.6414-1.09746-4.5447L16.647 44.4285c.974-1.6673 2.6414-2.0715 4.5447-1.0975l.0001.0001c4.7634 2.7864 10.8656 1.1191 13.6521-3.6443 2.7864-4.7634 1.1191-10.8657-3.6443-13.6521-4.7635-2.7864-10.8657-1.1191-13.6521 3.6443z"/></svg>` },
  { name: "Notion", src: null, svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z" fill-rule="evenodd"/></svg>` },
];

const steps = [
  { n: "1", title: "Create your workspace", desc: "Sign up, name your organization, and invite your team with a single link." },
  { n: "2", title: "Set up your channels", desc: "Organize conversations by team, project, or topic. Set permissions and roles." },
  { n: "3", title: "Connect your tools", desc: "Integrate with GitHub, Jira, Figma, and 100+ other tools your team already uses." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: "64px 0 80px" }}>
        <div style={{ ...section, ...center }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "4px 12px", borderRadius: 20, border: "1px solid var(--border)",
            backgroundColor: "var(--surface)", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--success)" }} />
            Now in public beta
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "var(--heading)", lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 700, margin: "0 auto" }}>
            Communications for everything important
          </h1>
          <p style={{ marginTop: 20, fontSize: "clamp(15px, 2vw, 18px)", color: "var(--body)", maxWidth: 520, margin: "20px auto 0", lineHeight: 1.6 }}>
            One platform for messaging, channels, and integrations. Built for teams that need reliability, security, and speed.
          </p>
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/signup"><Button size="lg">Get Started Free &rarr;</Button></Link>
            <Link href="/pricing"><Button variant="secondary" size="lg">View Pricing</Button></Link>
          </div>
          <p style={{ marginTop: 16, fontSize: 12, color: "var(--body-light)" }}>
            Free forever for small teams. No credit card required.
          </p>
        </div>
      </section>

      {/* Trusted By */}
      <section style={{ ...sectionBorder, padding: "40px 0" }}>
        <div style={section}>
          <p style={{ ...center, fontSize: 12, fontWeight: 500, color: "var(--body-light)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>
            Trusted by teams at
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 56, flexWrap: "wrap", opacity: 0.4 }}>
            {trustedLogos.map((logo) => (
              <div key={logo.name} style={{ height: 36, width: "auto", color: "var(--heading)" }} title={logo.name}>
                {logo.src ? (
                  <Image src={logo.src} alt={logo.name} width={120} height={36} style={{ height: 36, width: "auto" }} />
                ) : (
                  <div style={{ height: 36, width: 120 }} dangerouslySetInnerHTML={{ __html: logo.svg! }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ ...sectionBorder, padding: "48px 0 56px" }}>
        <div style={{ ...section, maxWidth: 960 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} style={center}>
                <div style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, color: "var(--heading)", letterSpacing: "-0.01em" }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "var(--body-light)", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ ...sectionBorder, padding: "64px 0 72px" }}>
        <div style={section}>
          <div style={{ ...center, marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "var(--heading)", letterSpacing: "-0.01em" }}>
              Everything your team needs
            </h2>
            <p style={{ marginTop: 12, fontSize: 15, color: "var(--body)", maxWidth: 480, margin: "12px auto 0" }}>
              A complete communications platform designed for scale, security, and simplicity.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="features-grid">
            {features.map((f) => (
              <div key={f.title} style={{
                backgroundColor: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: 24, boxShadow: "var(--shadow-sm)",
                transition: "box-shadow var(--transition)",
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--heading)", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ ...sectionBorder, padding: "64px 0 72px", backgroundColor: "var(--surface)" }}>
        <div style={{ ...section, maxWidth: 800 }}>
          <div style={{ ...center, marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "var(--heading)", letterSpacing: "-0.01em" }}>
              Up and running in minutes
            </h2>
            <p style={{ marginTop: 12, fontSize: 15, color: "var(--body)", maxWidth: 480, margin: "12px auto 0" }}>
              No complicated setup. No onboarding calls. Just sign up and start communicating.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {steps.map((item) => (
              <div key={item.n} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", backgroundColor: "var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{item.n}</span>
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: "var(--heading)", marginBottom: 4 }}>{item.title}</h4>
                  <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...sectionBorder, padding: "64px 0 80px" }}>
        <div style={{ ...section, ...center, maxWidth: 600 }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "var(--heading)", letterSpacing: "-0.01em" }}>
            Ready to get started?
          </h2>
          <p style={{ marginTop: 12, fontSize: 15, color: "var(--body)", maxWidth: 420, margin: "12px auto 0" }}>
            Join thousands of teams already using Chatterbox. Free forever for small teams.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link href="/signup"><Button size="lg">Start for Free &rarr;</Button></Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
