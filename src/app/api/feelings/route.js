import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import path from "path";
import { FEELING_AUDIO_OVERRIDES } from "@/lib/feelings";

var FEELINGS_DIR = path.join(process.cwd(), "Feelings");
var IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

function isSafeName(name) {
  return !!name && path.basename(name) === name;
}

async function readFeelingDirectory() {
  var files = await readdir(FEELINGS_DIR);
  var imageByName = {};
  var audioNames = new Set();

  files.forEach(function(fileName) {
    var extension = path.extname(fileName).toLowerCase();
    var baseName = path.basename(fileName, extension);

    if (IMAGE_EXTENSIONS.indexOf(extension) >= 0) {
      imageByName[baseName] = extension;
      return;
    }

    if (extension === ".m4a") {
      audioNames.add(baseName);
    }
  });

  return {
    imageByName: imageByName,
    audioNames: audioNames,
  };
}

async function listFeelingItems() {
  var directoryData = await readFeelingDirectory();

  return Object.keys(directoryData.imageByName)
    .sort(function(a, b) { return a.localeCompare(b, "he"); })
    .map(function(name) {
      var audioName = directoryData.audioNames.has(name)
        ? name
        : (FEELING_AUDIO_OVERRIDES[name] && directoryData.audioNames.has(FEELING_AUDIO_OVERRIDES[name]) ? FEELING_AUDIO_OVERRIDES[name] : null);

      return {
        id: name,
        label: name,
        imageSrc: "/api/feelings?type=image&name=" + encodeURIComponent(name),
        audioName: audioName,
      };
    });
}

async function serveFeelingImage(name) {
  var directoryData = await readFeelingDirectory();
  var extension = directoryData.imageByName[name];

  if (!extension) {
    return NextResponse.json({ error: "Feeling image not found" }, { status: 404 });
  }

  var imagePath = path.join(FEELINGS_DIR, name + extension);
  var imageBuffer = await readFile(imagePath);
  var contentType = extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/" + extension.slice(1);

  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function GET(request) {
  var url = new URL(request.url);
  var type = url.searchParams.get("type");
  var name = url.searchParams.get("name");

  try {
    if (type === "image") {
      if (!isSafeName(name)) {
        return NextResponse.json({ error: "Invalid feeling image name" }, { status: 400 });
      }
      return await serveFeelingImage(name);
    }

    var items = await listFeelingItems();
    return NextResponse.json({ items: items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load feelings" }, { status: 500 });
  }
}
