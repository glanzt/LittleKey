import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request) {
  var url = new URL(request.url);
  var name = url.searchParams.get("name");

  if (!name || path.basename(name) !== name) {
    return NextResponse.json({ error: "Invalid feeling audio name" }, { status: 400 });
  }

  try {
    var audioPath = path.join(process.cwd(), "Feelings", name + ".m4a");
    var audioBuffer = await readFile(audioPath);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mp4",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Audio file not found" }, { status: 404 });
  }
}
