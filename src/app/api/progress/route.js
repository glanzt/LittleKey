import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [settings, levelProgress, letterStats, gameSessions] = await Promise.all([
    prisma.userSettings.findUnique({ where: { userId } }),
    prisma.userLevelProgress.findMany({ where: { userId }, orderBy: { level: "asc" } }),
    prisma.userLetterStats.findMany({ where: { userId } }),
    prisma.userGameSession.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 100 }),
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

  const userId = session.user.id;
  const body = await request.json();

  const ops = [];

  if (body.settings) {
    ops.push(
      prisma.userSettings.upsert({
        where: { userId },
        create: { userId, data: body.settings },
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
          where: { userId_level: { userId, level } },
          create: { userId, level, completed: data.completed ?? false, accuracy: data.accuracy ?? null, stars: data.stars ?? 0 },
          update: { completed: data.completed ?? false, accuracy: data.accuracy ?? null, stars: data.stars ?? 0 },
        })
      );
    }
  }

  if (body.letterStats) {
    for (const [letter, data] of Object.entries(body.letterStats)) {
      ops.push(
        prisma.userLetterStats.upsert({
          where: { userId_letter: { userId, letter } },
          create: {
            userId, letter,
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
