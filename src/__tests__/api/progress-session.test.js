/**
 * @jest-environment node
 */
import { POST } from "@/app/api/progress/session/route";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => require("@/__mocks__/prisma"));
jest.mock("@/lib/auth", () => require("@/__mocks__/auth"));

const AUTHED_SESSION = { user: { id: "user-1" } };

function makeRequest(body) {
  return new Request("http://localhost/api/progress/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/progress/session", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    auth.mockResolvedValue(null);
    const res = await POST(makeRequest({ profileId: "p1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when profileId is missing", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 403 when profile belongs to another user", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "other-user" });

    const res = await POST(makeRequest({ profileId: "p1" }));
    expect(res.status).toBe(403);
  });

  it("creates game session and returns 201", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userGameSession.create.mockResolvedValue({ id: "gs-new" });

    const sessionData = {
      profileId: "p1",
      mode: "levels",
      totalQuestions: 10,
      completed: 8,
      accuracy: 0.8,
      avgTtc: 2.5,
      duration: 300,
      level: 5,
    };

    const res = await POST(makeRequest(sessionData));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBe("gs-new");
  });

  it("also upserts letter stats when provided", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userGameSession.create.mockResolvedValue({ id: "gs2" });
    prisma.userLetterStats.upsert.mockResolvedValue({});

    const res = await POST(makeRequest({
      profileId: "p1",
      totalQuestions: 5,
      completed: 5,
      accuracy: 1.0,
      letterStats: {
        "ב": { attempts: 3, correct: 3, totalTtc: 4.5, bestTtc: 1.2 },
      },
    }));

    expect(res.status).toBe(201);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("also upserts level progress when provided", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userGameSession.create.mockResolvedValue({ id: "gs3" });
    prisma.userLevelProgress.upsert.mockResolvedValue({});

    const res = await POST(makeRequest({
      profileId: "p1",
      totalQuestions: 10,
      completed: 10,
      accuracy: 0.9,
      levelProgress: {
        levels: { "3": { completed: true, accuracy: 0.9, stars: 2 } },
      },
    }));

    expect(res.status).toBe(201);
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
