/**
 * @jest-environment node
 */
import { POST } from "@/app/api/auth/register/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

jest.mock("@/lib/prisma", () => require("@/__mocks__/prisma"));
jest.mock("bcryptjs");

function makeRequest(body) {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/register", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ password: "123456" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/email/i);
  });

  it("returns 400 when password is missing", async () => {
    const res = await POST(makeRequest({ email: "test@mail.com" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/password/i);
  });

  it("returns 400 when password is too short", async () => {
    const res = await POST(makeRequest({ email: "a@b.com", password: "12345" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/6 characters/i);
  });

  it("returns 409 when email already exists", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "existing", email: "a@b.com" });

    const res = await POST(makeRequest({ email: "a@b.com", password: "123456" }));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/already exists/i);
  });

  it("creates user and returns 201 on valid input", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed_password");
    prisma.user.create.mockResolvedValue({
      id: "new-user-id",
      email: "test@mail.com",
      name: "test",
    });

    const res = await POST(
      makeRequest({ email: "test@mail.com", password: "securepass", name: "Test User" })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBe("new-user-id");
    expect(data.email).toBe("test@mail.com");
    expect(bcrypt.hash).toHaveBeenCalledWith("securepass", 12);
  });

  it("defaults name to email prefix when name is not provided", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed");
    prisma.user.create.mockResolvedValue({ id: "u1", email: "hello@world.com", name: "hello" });

    await POST(makeRequest({ email: "hello@world.com", password: "123456" }));

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: "hello" }),
    });
  });

  it("returns 500 on unexpected error", async () => {
    prisma.user.findUnique.mockRejectedValue(new Error("DB down"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(makeRequest({ email: "a@b.com", password: "123456" }));
    expect(res.status).toBe(500);

    spy.mockRestore();
  });
});
