import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Resend
vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: "test" }, error: null }),
    },
  },
}));

// Mock Supabase admin
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      update: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
      insert: () => Promise.resolve({ error: null }),
    }),
  }),
}));

describe("Send Code API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if email is missing", async () => {
    const { POST } = await import("@/app/api/auth/send-code/route");
    const request = new Request("http://localhost/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Email is required");
  });

  it("returns success for valid email", async () => {
    const { POST } = await import("@/app/api/auth/send-code/route");
    const request = new Request("http://localhost/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", fullName: "Test User" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
