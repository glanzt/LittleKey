export var PAGE_BG = {
  minHeight: "100vh",
  background: "#fafafa",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Rubik', sans-serif",
  direction: "rtl",
  padding: "2rem",
  boxSizing: "border-box",
};

export var PRACTICE_SESSION_LENGTH = 5;
export var TTC_OUTLIER_MS = 60000;
export var ENABLE_PROGRESS_PERSISTENCE = true;

export var BACK_BUTTON_STYLE = {
  position: "absolute",
  top: "1.5rem",
  left: "1.5rem",
  zIndex: 12,
  background: "white",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 999,
  padding: "0.45rem 1rem",
  cursor: "pointer",
  fontSize: "0.95rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  fontFamily: "'Secular One', sans-serif",
  color: "#111319",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
};

export var TOP_BAR_HEIGHT = 56;

export var HEBREW_LETTERS = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"];

export var KEYBOARD_ROWS = {
  top: ["ק","ר","א","ט","ו","ן","ם","פ"],
  middle: ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
  bottom: ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"]
};

export var NIKUD_MAP = {
  "\u05E7\u05B8\u05DE\u05B8\u05E5": "\u05B8",
  "\u05E4\u05B7\u05BC\u05EA\u05B8\u05D7": "\u05B7",
  "\u05D7\u05B4\u05D9\u05E8\u05B4\u05D9\u05E7": "\u05B4",
  "\u05E6\u05B5\u05D9\u05E8\u05B5\u05D9": "\u05B5",
  "\u05E1\u05B6\u05D2\u05BC\u05D5\u05B9\u05DC": "\u05B6",
  "\u05E9\u05C1\u05D5\u05BC\u05E8\u05D5\u05BC\u05E7": "\u05BC",
  "\u05D7\u05D5\u05B9\u05DC\u05B8\u05DD": "\u05B9",
  "\u05E7\u05D5\u05BC\u05D1\u05BC\u05D5\u05BC\u05E5": "\u05BB"
};

export var FINAL_FORMS = { "\u05DB": "\u05DA", "\u05DE": "\u05DD", "\u05E0": "\u05DF", "\u05E4": "\u05E3", "\u05E6": "\u05E5" };

export var KEY_TO_LETTER = {};
HEBREW_LETTERS.forEach(function(l) { KEY_TO_LETTER[l] = l; });
Object.entries(FINAL_FORMS).forEach(function(entry) { KEY_TO_LETTER[entry[1]] = entry[0]; });

export var LETTER_NAMES = {
  "א": "אלף", "ב": "בית", "ג": "גימל", "ד": "דלת", "ה": "הא", "ו": "ואו",
  "ז": "זין", "ח": "חית", "ט": "טית", "י": "יוד", "כ": "כף", "ל": "למד",
  "מ": "מם", "נ": "נון", "ס": "סמך", "ע": "עין", "פ": "פא", "צ": "צדי",
  "ק": "קוף", "ר": "ריש", "ש": "שין", "ת": "תו"
};

export var SUCCESS_MSGS = [
  "\u05DB\u05DC \u05D4\u05DB\u05D1\u05D5\u05D3! \uD83C\uDF89",
  "\u05DE\u05E2\u05D5\u05DC\u05D4! \u2B50",
  "\u05D9\u05D5\u05E4\u05D9! \uD83C\uDF1F",
  "\u05E0\u05D4\u05D3\u05E8! \uD83D\uDC4F",
  "\u05D0\u05EA \u05D0\u05DC\u05D5\u05E4\u05D4! \uD83C\uDFC6",
  "\u05D5\u05D0\u05D5! \uD83D\uDCAB"
];

export var ERROR_MSGS = [
  "\u05DB\u05DE\u05E2\u05D8! \u05E0\u05E1\u05D9 \u05E9\u05D5\u05D1 \uD83D\uDCAA",
  "\u05E2\u05D5\u05D3 \u05E7\u05E6\u05EA! \uD83C\uDF08",
  "\u05DC\u05D0 \u05E0\u05D5\u05E8\u05D0, \u05E0\u05E1\u05D9 \u05E9\u05D5\u05D1! \uD83D\uDE0A",
  "\u05E7\u05E8\u05D5\u05D1! \uD83C\uDFAF"
];

export var AVATAR_OPTIONS = ["🧒","👧","👦","🧒🏻","👧🏻","👦🏻","🧒🏽","👧🏽","👦🏽","🐱","🦊","🐶","🐰","🦁","🐻","🦄","🐸","🐼"];

export var LEVELS_PER_PAGE = 20;
export var TOTAL_LEVELS = 1000;

export var DEFAULT_SETTINGS = {
  sessionLength: PRACTICE_SESSION_LENGTH,
  letterSet: HEBREW_LETTERS.slice(),
  nikud: false,
  nikudType: Object.keys(NIKUD_MAP)[0],
  helpLevel: "beginner",
  voiceGender: "male"
};

/* ── Audio ── */
var audioCtx = null;
function getAudioCtx() {
  if (!audioCtx && typeof window !== "undefined") {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}
export { getAudioCtx };

export function playTone(notes, vol, gap, dur) {
  var ctx = getAudioCtx();
  if (!ctx) return;
  ctx.resume();
  notes.forEach(function(freq, i) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime + i * gap);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * gap + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * gap);
    osc.stop(ctx.currentTime + i * gap + dur);
  });
}

export function playSuccess() { playTone([523.25, 659.25, 783.99, 1046.5], 0.18, 0.1, 0.35); }
export function playPerfect() { playTone([523.25, 659.25, 783.99, 1046.5, 1318.51], 0.12, 0.08, 0.4); }
export function playCardFlip() {
  var ctx = getAudioCtx();
  if (!ctx) return;
  ctx.resume();

  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  var filter = ctx.createBiquadFilter();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.045);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1900, ctx.currentTime);

  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
}

export function playError() {
  var ctx = getAudioCtx();
  if (!ctx) return;
  ctx.resume();
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 220;
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

export function playClap() {
  var ctx = getAudioCtx();
  if (!ctx) return;
  ctx.resume();
  for (var i = 0; i < 3; i++) {
    var t = ctx.currentTime + i * 0.12;
    var buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var j = 0; j < data.length; j++) {
      data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (data.length / 6));
    }
    var src = ctx.createBufferSource();
    var gain = ctx.createGain();
    src.buffer = buffer;
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
  }
}

/* ── Recorded Audio Playback ── */
var _playbackId = 0;
var _currentAudio = null;
var CLIP_OVERLAP_MS = 550;
var _voiceGender = "male";

export function setVoiceGender(v) { _voiceGender = v; }

export function stopPlayback() {
  _playbackId++;
  if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
}

function playRecording(name, pid) {
  return new Promise(function(resolve) {
    if (pid !== _playbackId) { resolve(); return; }
    var folder = _voiceGender === "kid" ? "/recordings-kid/" : _voiceGender === "female" ? "/recordings-female/" : "/recordings/";
    var src = folder + encodeURIComponent(name) + ".m4a";
    var audio = new Audio(src);
    _currentAudio = audio;
    var resolved = false;
    function done() {
      if (resolved) return;
      resolved = true;
      _currentAudio = null;
      resolve();
    }
    audio.onended = done;
    audio.onerror = done;
    audio.onloadedmetadata = function() {
      if (audio.duration > CLIP_OVERLAP_MS / 1000) {
        setTimeout(done, (audio.duration * 1000) - CLIP_OVERLAP_MS);
      }
    };
    audio.play().catch(done);
  });
}

export function playRecordingSeq(names) {
  stopPlayback();
  var id = _playbackId;
  var chain = Promise.resolve();
  names.forEach(function(name) {
    chain = chain.then(function() { return playRecording(name, id); });
  });
  return chain;
}

export function speakLetter(letter) {
  var base = KEY_TO_LETTER[letter] || letter;
  playRecordingSeq([base]);
}

/* ── Persistence ── */
export function storageKey(base, profileId) {
  return profileId ? base + "-" + profileId : base;
}

export function loadData(key, fallback) {
  if (!ENABLE_PROGRESS_PERSISTENCE) return fallback;
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveData(key, val) {
  if (!ENABLE_PROGRESS_PERSISTENCE) return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* noop */ }
}

/* ── Helpers ── */
export function getStarsForAccuracy(accuracy) {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 1) return 1;
  return 0;
}
