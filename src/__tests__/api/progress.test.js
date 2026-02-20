/**
 * @jest-environment node
 */
import { GET, POST } from "@/app/api/progress/route";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => require("@/__mocks__/prisma"));
jest.mock("@/lib/auth", () => require("@/__mocks__/auth"));

const AUTHED_SESSION = { user: { id: "user-1" } };

function makeGetRequest(profileId) {
  return new Request(`http://localhost/api/progress?profileId=${profileId}`);
}

function makePostRequest(body) {
  return new Request("http://localhost/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/progress", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    auth.mockResolvedValue(null);
    const res = await GET(makeGetRequest("p1"));
    expect(res.status).toBe(401);
  });

  it("returns 400 when profileId is missing", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    const res = await GET(new Request("http://localhost/api/progress"));
    expect(res.status).toBe(400);
  });

  it("returns 403 when profile belongs to another user", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "other-user" });

    const res = await GET(makeGetRequest("p1"));
    expect(res.status).toBe(403);
  });

  it("returns progress data for owned profile", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userSettings.findUnique.mockResolvedValue({ profileId: "p1", data: { sessionLength: 10 } });
    prisma.userLevelProgress.findMany.mockResolvedValue([
      { level: 1, completed: true, accuracy: 0.9, stars: 3 },
      { level: 2, completed: false, accuracy: null, stars: 0 },
    ]);
    prisma.userLetterStats.findMany.mockResolvedValue([
      { letter: "א", attempts: 10, correct: 8, totalTtc: 15.5, bestTime: 1.2, lastDate: new Date("2025-01-15") },
    ]);
    prisma.userGameSession.findMany.mockResolvedValue([
      {
        id: "gs1", date: new Date("2025-01-15"), mode: "levels",
        total: 10, completed: 8, accuracy: 0.8, avgTtc: 2.1, duration: 300, data: null,
      },
    ]);

    const res = await GET(makeGetRequest("p1"));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.settings).toEqual({ sessionLength: 10 });
    expect(data.levelProgress.currentLevel).toBe(2);
    expect(data.levelProgress.levels["1"].stars).toBe(3);
    expect(data.letterStats["א"].attempts).toBe(10);
    expect(data.sessions).toHaveLength(1);
  });

  it("returns null settings when no settings exist", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userSettings.findUnique.mockResolvedValue(null);
    prisma.userLevelProgress.findMany.mockResolvedValue([]);
    prisma.userLetterStats.findMany.mockResolvedValue([]);
    prisma.userGameSession.findMany.mockResolvedValue([]);

    const res = await GET(makeGetRequest("p1"));
    const data = await res.json();
    expect(data.settings).toBeNull();
    expect(data.levelProgress.currentLevel).toBe(1);
  });
});

describe("POST /api/progress", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    auth.mockResolvedValue(null);
    const res = await POST(makePostRequest({ profileId: "p1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when profileId is missing", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    const res = await POST(makePostRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 403 when profile belongs to another user", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "other-user" });

    const res = await POST(makePostRequest({ profileId: "p1" }));
    expect(res.status).toBe(403);
  });

  it("upserts settings when provided", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userSettings.upsert.mockResolvedValue({});

    const res = await POST(makePostRequest({
      profileId: "p1",
      settings: { sessionLength: 15 },
    }));
    expect(res.status).toBe(200);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("upserts level progress when provided", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userLevelProgress.upsert.mockResolvedValue({});

    const res = await POST(makePostRequest({
      profileId: "p1",
      levelProgress: { levels: { "1": { completed: true, accuracy: 0.95, stars: 3 } } },
    }));
    expect(res.status).toBe(200);
  });

  it("upserts letter stats when provided", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });
    prisma.userLetterStats.upsert.mockResolvedValue({});

    const res = await POST(makePostRequest({
      profileId: "p1",
      letterStats: { "א": { attempts: 5, correct: 4, totalTtc: 8.3, bestTtc: 1.1 } },
    }));
    expect(res.status).toBe(200);
  });

  it("skips transaction when no data is provided", async () => {
    auth.mockResolvedValue(AUTHED_SESSION);
    prisma.childProfile.findUnique.mockResolvedValue({ id: "p1", userId: "user-1" });

    const res = await POST(makePostRequest({ profileId: "p1" }));
    expect(res.status).toBe(200);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
