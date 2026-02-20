/**
 * @jest-environment node
 */
import { GET, POST } from "@/app/api/profiles/route";
import { DELETE } from "@/app/api/profiles/[id]/route";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => require("@/__mocks__/prisma"));
jest.mock("@/lib/auth", () => require("@/__mocks__/auth"));

const AUTHED_SESSION = { user: { id: "user-1" } };

function makeRequest(body) {
  return new Request("http://localhost/api/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/profiles", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    auth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns profiles for authenticated user", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findMany.mockResolvedValue([
      { id: "p1", name: "דני", avatar: "🧒", createdAt: new Date() },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.profiles).toHaveLength(1);
    expect(data.profiles[0].name).toBe("דני");
  });
});

describe("POST /api/profiles", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    auth.mockResolvedValue(null);
    const res = await POST(makeRequest({ name: "Test" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for empty name", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    const res = await POST(makeRequest({ name: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for name longer than 30 chars", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    const res = await POST(makeRequest({ name: "a".repeat(31) }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when user already has 10 profiles", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.count.mockResolvedValue(10);

    const res = await POST(makeRequest({ name: "Child 11" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/too many/i);
  });

  it("creates profile with valid input and returns 201", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.count.mockResolvedValue(2);
    prisma.childProfile.create.mockResolvedValue({
      id: "new-p", name: "נועה", avatar: "👧", createdAt: new Date(),
    });

    const res = await POST(makeRequest({ name: "נועה", avatar: "👧" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.profile.name).toBe("נועה");
    expect(data.profile.avatar).toBe("👧");
  });

  it("defaults avatar to 🧒 for unknown emoji", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.count.mockResolvedValue(0);
    prisma.childProfile.create.mockResolvedValue({
      id: "p2", name: "טל", avatar: "🧒", createdAt: new Date(),
    });

    await POST(makeRequest({ name: "טל", avatar: "🚀" }));

    expect(prisma.childProfile.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ avatar: "🧒" }),
      select: expect.any(Object),
    });
  });
});

describe("DELETE /api/profiles/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    auth.mockResolvedValue(null);
    const res = await DELETE(
      new Request("http://localhost/api/profiles/p1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "p1" }) }
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 when profile does not exist", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue(null);

    const res = await DELETE(
      new Request("http://localhost/api/profiles/nonexistent", { method: "DELETE" }),
      { params: Promise.resolve({ id: "nonexistent" }) }
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 when profile belongs to another user", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "other-user" });

    const res = await DELETE(
      new Request("http://localhost/api/profiles/p1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "p1" }) }
    );
    expect(res.status).toBe(404);
  });

  it("deletes profile and returns ok", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.childProfile.delete.mockResolvedValue({});

    const res = await DELETE(
      new Request("http://localhost/api/profiles/p1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "p1" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
