import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { message, rating } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
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
