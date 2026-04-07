const fs = require("fs");
const path = require("path");
const vm = require("vm");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_v3";
const LIMIT = Number(process.env.GAN_SHELI_AUDIO_LIMIT || "0");

const LEVELS_SOURCE_PATH = path.join(process.cwd(), "src", "lib", "gan-sheli-levels.js");
const OUTPUT_DIR = path.join(process.cwd(), "public", "audio", "gan-sheli");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");

if (!API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY");
}

if (!VOICE_ID) {
  throw new Error("Missing ELEVENLABS_VOICE_ID");
}

function padStageId(stageId) {
  return String(stageId).padStart(3, "0");
}

function buildClipPath(stageId, kind) {
  return path.join(OUTPUT_DIR, `${padStageId(stageId)}-${kind}.mp3`);
}

function normalizeText(text) {
  return text
    .replace(/—/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadLevels(sourceText) {
  const executableSource = `${sourceText.replace("export const levels =", "const levels =")}\nmodule.exports = { levels };`;
  const sandbox = {
    module: { exports: {} },
    exports: {},
  };

  vm.runInNewContext(executableSource, sandbox, { filename: LEVELS_SOURCE_PATH });

  return (sandbox.module.exports.levels || [])
    .map((level) => ({
      id: level.id,
      name: level.name,
      voiceover: level.voiceover,
      correctFeedback: level.correctFeedback,
      incorrectFeedback: level.incorrectFeedback,
    }))
    .filter((level) => level.id && level.name && level.voiceover && level.correctFeedback && level.incorrectFeedback)
    .sort((left, right) => left.id - right.id);
}

async function synthesize(text) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: normalizeText(text),
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs request failed (${response.status}): ${body}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function writeClip(stageId, kind, text) {
  const targetPath = buildClipPath(stageId, kind);
  if (fs.existsSync(targetPath)) {
    console.log(`skip ${path.basename(targetPath)}`);
    return;
  }

  console.log(`generate ${path.basename(targetPath)}`);
  const buffer = await synthesize(text);
  fs.writeFileSync(targetPath, buffer);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const sourceText = fs.readFileSync(LEVELS_SOURCE_PATH, "utf8");
  const parsedLevels = loadLevels(sourceText);
  const levels = LIMIT > 0 ? parsedLevels.slice(0, LIMIT) : parsedLevels;

  const manifest = levels.map((level) => ({
    id: level.id,
    title: {
      text: level.name,
      path: `/audio/gan-sheli/${padStageId(level.id)}-title.mp3`,
    },
    voiceover: {
      text: level.voiceover,
      path: `/audio/gan-sheli/${padStageId(level.id)}-voiceover.mp3`,
    },
    success: {
      text: level.correctFeedback,
      path: `/audio/gan-sheli/${padStageId(level.id)}-success.mp3`,
    },
    failure: {
      text: level.incorrectFeedback,
      path: `/audio/gan-sheli/${padStageId(level.id)}-failure.mp3`,
    },
  }));

  for (const level of levels) {
    await writeClip(level.id, "title", level.name);
    await writeClip(level.id, "voiceover", level.voiceover);
    await writeClip(level.id, "success", level.correctFeedback);
    await writeClip(level.id, "failure", level.incorrectFeedback);
  }

  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
      {
        modelId: MODEL_ID,
        generatedAt: new Date().toISOString(),
        count: manifest.length,
        clipsPerLevel: 4,
        levels: manifest,
      },
      null,
      2
    ) + "\n"
  );

  console.log(`done: ${levels.length} levels`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
