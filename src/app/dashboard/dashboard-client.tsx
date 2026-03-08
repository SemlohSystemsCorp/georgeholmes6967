"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  inviteCode: string;
  role: string;
}

interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl: string;
}

interface DashboardClientProps {
  user: UserInfo;
  initialWorkspaces: Workspace[];
}

export default function DashboardClient({ user, initialWorkspaces }: DashboardClientProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Realtime subscription for workspace changes
  useEffect(() => {
    const supabase = createClient();

    // Listen for changes to organizations the user is a member of
    const orgIds = workspaces.map((w) => w.id);
    if (orgIds.length === 0) return;

    const channel = supabase
      .channel("dashboard-orgs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "organizations",
          filter: `id=in.(${orgIds.join(",")})`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as { id: string; name: string; slug: string; plan: string; invite_code: string };
            setWorkspaces((prev) =>
              prev.map((w) =>
                w.id === updated.id
                  ? { ...w, name: updated.name, slug: updated.slug, plan: updated.plan, inviteCode: updated.invite_code }
                  : w
              )
            );
          } else if (payload.eventType === "DELETE") {
            setWorkspaces((prev) => prev.filter((w) => w.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "organization_members",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const newMembership = payload.new as { organization_id: string; role: string };
          // Fetch the new org details
          const { data: org } = await supabase
            .from("organizations")
            .select("id, name, slug, plan, invite_code")
            .eq("id", newMembership.organization_id)
            .single();
          if (org) {
            setWorkspaces((prev) => {
              if (prev.some((w) => w.id === org.id)) return prev;
              return [...prev, {
                id: org.id,
                name: org.name,
                slug: org.slug,
                plan: org.plan || "free",
                inviteCode: org.invite_code || "",
                role: newMembership.role,
              }];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, workspaces]);

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* Nav */}
      <nav style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", height: 60, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">Pricing</Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm">Settings</Button>
          </Link>

          {/* Avatar dropdown */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 34, height: 34, borderRadius: "50%", border: "2px solid var(--border)",
                backgroundColor: user.avatarUrl ? "transparent" : "var(--primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", padding: 0,
              }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{initials}</span>
              )}
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, top: 42, width: 240,
                backgroundColor: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)",
                zIndex: 50, overflow: "hidden",
              }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--heading)", marginBottom: 2 }}>{user.fullName}</p>
                  <p style={{ fontSize: 12, color: "var(--body-light)" }}>@{user.username}</p>
                  <p style={{ fontSize: 12, color: "var(--body-light)", marginTop: 2 }}>{user.email}</p>
                </div>
                <div style={{ padding: "4px 0" }}>
                  <Link href="/settings" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                    <div style={{ padding: "8px 16px", fontSize: 13, color: "var(--body)", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >Profile &amp; Settings</div>
                  </Link>
                  <Link href="/checkout/pro" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                    <div style={{ padding: "8px 16px", fontSize: 13, color: "var(--body)", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >Upgrade Plan</div>
                  </Link>
                  <Link href="/pricing" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                    <div style={{ padding: "8px 16px", fontSize: 13, color: "var(--body)", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >View Plans</div>
                  </Link>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", padding: "4px 0" }}>
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" style={{
                      width: "100%", textAlign: "left", padding: "8px 16px",
                      fontSize: 13, color: "var(--error)", cursor: "pointer",
                      background: "none", border: "none", fontFamily: "inherit",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >Sign Out</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--heading)", marginBottom: 24 }}>
          Dashboard
        </h2>

        {/* Welcome */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: user.avatarUrl ? "transparent" : "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
            }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{initials}</span>
              )}
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--heading)" }}>{user.fullName}</p>
              <p style={{ fontSize: 13, color: "var(--body-light)" }}>@{user.username} &middot; {user.email}</p>
            </div>
          </div>
        </Card>

        {/* Workspaces */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--heading)" }}>Workspaces</h3>
            <Link href="/onboarding">
              <Button variant="secondary" size="sm">Create Workspace</Button>
            </Link>
          </div>

          {workspaces.length === 0 ? (
            <Card>
              <p style={{ fontSize: 14, color: "var(--body)", textAlign: "center" }}>
                You don&apos;t have any workspaces yet.
              </p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {workspaces.map((ws) => (
                <Card key={ws.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "var(--radius)",
                        backgroundColor: "var(--primary-light)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 700, color: "var(--primary)",
                      }}>
                        {ws.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--heading)" }}>{ws.name}</p>
                        <p style={{ fontSize: 12, color: "var(--body-light)" }}>
                          {ws.role} &middot; {ws.plan === "free" ? "Hobby" : ws.plan === "pro" ? "Pro" : "Enterprise"} plan
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {ws.plan === "free" && (
                        <Link href="/checkout/pro">
                          <Button variant="secondary" size="sm">Upgrade</Button>
                        </Link>
                      )}
                      {ws.plan === "pro" && (
                        <Link href="/checkout/enterprise">
                          <Button variant="secondary" size="sm">Upgrade</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Plans */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--heading)", marginBottom: 16 }}>Plans</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Link href="/checkout/pro" style={{ textDecoration: "none" }}>
              <Card>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--heading)", marginBottom: 4 }}>Pro Plan</p>
                <p style={{ fontSize: 13, color: "var(--body)" }}>$29/mo per org &middot; Unlimited history, video calls, advanced search</p>
              </Card>
            </Link>
            <Link href="/checkout/enterprise" style={{ textDecoration: "none" }}>
              <Card>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--heading)", marginBottom: 4 }}>Enterprise Plan</p>
                <p style={{ fontSize: 13, color: "var(--body)" }}>$99/mo &middot; 500 GB storage, audit logs, SSO, dedicated infra</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
