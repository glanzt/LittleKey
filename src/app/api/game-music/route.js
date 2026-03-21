import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

var MUSIC_FILE_NAME = "mondamusic-synthwave-retro-pop-80s-491693.mp3";

export async function GET() {
  try {
    var musicPath = path.join(process.cwd(), "Music", MUSIC_FILE_NAME);
    var audioBuffer = await readFile(musicPath);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Background music file not found" }, { status: 404 });
  }
}
