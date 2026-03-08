"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useState, useEffect } from "react";

interface WorkspaceInfo {
  name: string;
  memberCount: number;
}

export default function JoinWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const res = await fetch(`/api/join/${workspaceId}`);
        if (!res.ok) { setError("Workspace not found or invite link is invalid."); setLoading(false); return; }
        const data = await res.json();
        setWorkspace(data);
      } catch {
        setError("Failed to load workspace.");
      }
      setLoading(false);
    }
    fetchWorkspace();
  }, [workspaceId]);

  async function handleJoin() {
    setJoining(true);
    setError("");
    try {
      const res = await fetch(`/api/join/${workspaceId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push(`/login?redirect=/join/${workspaceId}`); return; }
        setError(data.error || "Failed to join workspace.");
        setJoining(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setJoining(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
      <div style={{ marginBottom: 32 }}><Logo size="lg" /></div>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Card>
          {loading ? (
            <p style={{ fontSize: 14, color: "var(--body)", textAlign: "center" }}>Loading workspace...</p>
          ) : error && !workspace ? (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>Invalid invite</h3>
              <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 24 }}>{error}</p>
              <Button onClick={() => router.push("/dashboard")} variant="secondary">Go to Dashboard</Button>
            </div>
          ) : workspace ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "var(--radius)", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 4 }}>
                Join {workspace.name}
              </h3>
              <p style={{ fontSize: 13, color: "var(--body-light)", marginBottom: 24 }}>
                {workspace.memberCount} member{workspace.memberCount !== 1 ? "s" : ""}
              </p>

              {error && (
                <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px", marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <Button onClick={handleJoin} loading={joining} fullWidth size="lg">
                Join Workspace
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
