import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ALLOWED_AVATARS = ["🧒","👧","👦","🧒🏻","👧🏻","👦🏻","🧒🏽","👧🏽","👦🏽","🐱","🦊","🐶","🐰","🦁","🐻","🦄","🐸","🐼"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles = await prisma.childProfile.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, avatar: true, createdAt: true },
  });

  return NextResponse.json({ profiles });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = (body.name || "").trim();
  if (!name || name.length > 30) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const avatar = ALLOWED_AVATARS.includes(body.avatar) ? body.avatar : "🧒";

  const count = await prisma.childProfile.count({ where: { userId: session.user.id } });
  if (count >= 10) {
    return NextResponse.json({ error: "Too many profiles" }, { status: 400 });
  }

  const profile = await prisma.childProfile.create({
    data: { userId: session.user.id, name, avatar },
    select: { id: true, name: true, avatar: true, createdAt: true },
  });

  return NextResponse.json({ profile }, { status: 201 });
}
