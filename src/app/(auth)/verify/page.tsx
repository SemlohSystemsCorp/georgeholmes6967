"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, Suspense, CSSProperties } from "react";
import { createClient } from "@/lib/supabase/client";

const digitStyle: CSSProperties = {
  width: 44,
  height: 52,
  textAlign: "center",
  fontSize: 20,
  fontWeight: 700,
  color: "var(--heading)",
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  outline: "none",
  transition: "all var(--transition)",
  fontFamily: "inherit",
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5 && newCode.every((d) => d !== "")) handleVerify(newCode.join(""));
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  }

  async function handleVerify(codeStr?: string) {
    const fullCode = codeStr || code.join("");
    if (fullCode.length !== 6) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true);
    setError("");

    const signupData = sessionStorage.getItem("chatterbox_signup");
    if (!signupData) { setError("Signup session expired. Please start over."); setLoading(false); return; }
    const { password, fullName } = JSON.parse(signupData);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed."); setLoading(false); return; }

      sessionStorage.removeItem("chatterbox_signup");
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError("Account created but login failed. Please log in manually."); setLoading(false); return; }

      router.push("/account/welcome");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setResent(false);
    try {
      const signupData = sessionStorage.getItem("chatterbox_signup");
      const fullName = signupData ? JSON.parse(signupData).fullName : "";
      await fetch("/api/auth/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, fullName }) });
      setResent(true);
    } catch { setError("Failed to resend code."); }
    setResending(false);
  }

  return (
    <Card>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>Check your email</h3>
        <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 4 }}>We sent a 6-digit code to</p>
        {email && <p style={{ fontSize: 14, fontWeight: 500, color: "var(--heading)", marginBottom: 24 }}>{email}</p>}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }} onPaste={handlePaste}>
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px var(--focus-ring)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}
            style={digitStyle}
          />
        ))}
      </div>

      {error && (
        <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px", marginBottom: 16, textAlign: "center" }}>
          {error}
        </div>
      )}

      <Button onClick={() => handleVerify()} loading={loading} fullWidth disabled={code.some((d) => d === "")} style={{ marginBottom: 12 }}>
        Verify Email
      </Button>

      <div style={{ textAlign: "center" }}>
        {resent ? (
          <p style={{ fontSize: 13, color: "var(--success)", fontWeight: 500 }}>New code sent successfully.</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}
          >
            {resending ? "Sending..." : "Didn\u0027t get a code? Resend"}
          </button>
        )}
      </div>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<Card><p style={{ fontSize: 14, color: "var(--body)", textAlign: "center" }}>Loading...</p></Card>}>
      <VerifyContent />
    </Suspense>
  );
}
