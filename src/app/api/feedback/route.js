import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    // Clamp rating to 1-5 (or null); ignore anything else.
    const rating = Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : null;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    // This endpoint is public and unauthenticated; cap payload to limit abuse.
    if (message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const text = [
      "משוב חדש מציידת האותיות",
      "",
      rating ? `דירוג: ${"⭐".repeat(rating)} (${rating}/5)` : "ללא דירוג",
      "",
      "הודעה:",
      message.trim(),
      "",
      `נשלח בתאריך: ${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}`,
    ].join("\n");

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("=== FEEDBACK (SMTP not configured) ===");
      console.log(text);
      console.log("=======================================");
      return NextResponse.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "glantz@gmail.com",
      subject: `משוב חדש - ציידת האותיות${rating ? ` (${rating}/5 ⭐)` : ""}`,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback send error:", err);
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}
