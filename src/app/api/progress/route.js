import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function verifyProfileOwnership(userId, profileId) {
  const profile = await prisma.childProfile.findUnique({ where: { id: profileId } });
  return profile && profile.userId === userId;
}

export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({ error: "profileId required" }, { status: 400 });
  }

  if (!(await verifyProfileOwnership(session.user.id, profileId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [settings, levelProgress, letterStats, gameSessions] = await Promise.all([
    prisma.userSettings.findUnique({ where: { profileId } }),
    prisma.userLevelProgress.findMany({ where: { profileId }, orderBy: { level: "asc" } }),
    prisma.userLetterStats.findMany({ where: { profileId } }),
    prisma.userGameSession.findMany({ where: { profileId }, orderBy: { date: "desc" }, take: 100 }),
  ]);

  const levels = {};
  let currentLevel = 1;
  for (const lp of levelProgress) {
    levels[lp.level] = { completed: lp.completed, accuracy: lp.accuracy, stars: lp.stars };
    if (lp.completed && lp.level >= currentLevel) {
      currentLevel = lp.level + 1;
    }
  }

  const letterStatsMap = {};
  for (const ls of letterStats) {
    letterStatsMap[ls.letter] = {
      attempts: ls.attempts,
      correct: ls.correct,
      totalTtc: ls.totalTtc,
      bestTtc: ls.bestTime ?? Infinity,
      lastPracticed: ls.lastDate?.toISOString() ?? null,
    };
  }

  const sessionsData = gameSessions.map((gs) => ({
    id: gs.id,
    date: gs.date.toISOString(),
    mode: gs.mode,
    totalQuestions: gs.total,
    completed: gs.completed,
    accuracy: gs.accuracy,
    avgTtc: gs.avgTtc ?? 0,
    duration: gs.duration ?? 0,
    ...(gs.data ?? {}),
  }));

  return NextResponse.json({
    settings: settings?.data ?? null,
    levelProgress: { currentLevel: Math.min(currentLevel, 1001), levels },
    letterStats: letterStatsMap,
    sessions: sessionsData,
  });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profileId = body.profileId;
  if (!profileId) {
    return NextResponse.json({ error: "profileId required" }, { status: 400 });
  }

  if (!(await verifyProfileOwnership(session.user.id, profileId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ops = [];

  if (body.settings) {
    ops.push(
      prisma.userSettings.upsert({
        where: { profileId },
        create: { profileId, data: body.settings },
        update: { data: body.settings },
      })
    );
  }

  if (body.levelProgress?.levels) {
    for (const [levelStr, data] of Object.entries(body.levelProgress.levels)) {
      const level = parseInt(levelStr, 10);
      if (isNaN(level)) continue;
      ops.push(
        prisma.userLevelProgress.upsert({
          where: { profileId_level: { profileId, level } },
          create: { profileId, level, completed: data.completed ?? false, accuracy: data.accuracy ?? null, stars: data.stars ?? 0 },
          update: { completed: data.completed ?? false, accuracy: data.accuracy ?? null, stars: data.stars ?? 0 },
        })
      );
    }
  }

  if (body.letterStats) {
    for (const [letter, data] of Object.entries(body.letterStats)) {
      ops.push(
        prisma.userLetterStats.upsert({
          where: { profileId_letter: { profileId, letter } },
          create: {
            profileId, letter,
            attempts: data.attempts ?? 0,
            correct: data.correct ?? 0,
            totalTtc: data.totalTtc ?? 0,
            bestTime: data.bestTtc === Infinity ? null : (data.bestTtc ?? null),
            lastDate: data.lastPracticed ? new Date(data.lastPracticed) : null,
          },
          update: {
            attempts: data.attempts ?? 0,
            correct: data.correct ?? 0,
            totalTtc: data.totalTtc ?? 0,
            bestTime: data.bestTtc === Infinity ? null : (data.bestTtc ?? null),
            lastDate: data.lastPracticed ? new Date(data.lastPracticed) : null,
          },
        })
      );
    }
  }

  if (ops.length > 0) {
    await prisma.$transaction(ops);
  }

  return NextResponse.json({ ok: true });
}
