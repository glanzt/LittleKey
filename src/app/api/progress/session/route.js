import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const authSession = await auth();
  if (!authSession?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profileId = body.profileId;
  if (!profileId) {
    return NextResponse.json({ error: "profileId required" }, { status: 400 });
  }

  const profile = await prisma.childProfile.findUnique({ where: { id: profileId } });
  if (!profile || profile.userId !== authSession.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const gameSession = await prisma.userGameSession.create({
    data: {
      profileId,
      date: body.date ? new Date(body.date) : new Date(),
      mode: body.mode ?? null,
      total: body.totalQuestions ?? 0,
      completed: body.completed ?? 0,
      accuracy: body.accuracy ?? 0,
      avgTtc: body.avgTtc ?? null,
      duration: body.duration ?? null,
      data: {
        attempts: body.attempts,
        sequence: body.sequence,
        letterResults: body.letterResults,
        level: body.level,
        moves: body.moves,
        round: body.round,
      },
    },
  });

  if (body.letterStats) {
    const letterOps = Object.entries(body.letterStats).map(([letter, data]) =>
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
    await prisma.$transaction(letterOps);
  }

  if (body.levelProgress?.levels) {
    const levelOps = Object.entries(body.levelProgress.levels).map(([levelStr, data]) => {
      const level = parseInt(levelStr, 10);
      return prisma.userLevelProgress.upsert({
        where: { profileId_level: { profileId, level } },
        create: { profileId, level, completed: data.completed ?? false, accuracy: data.accuracy ?? null, stars: data.stars ?? 0 },
        update: { completed: data.completed ?? false, accuracy: data.accuracy ?? null, stars: data.stars ?? 0 },
      });
    });
    await prisma.$transaction(levelOps);
  }

  return NextResponse.json({ id: gameSession.id }, { status: 201 });
}
