"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { signOut } from "next-auth/react";
import useProgressSync from "@/hooks/useProgressSync";
import useProfiles from "@/hooks/useProfiles";
import { FloatingLettersBackground } from "@/styles/shared";

const PAGE_BG = {
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
const PRACTICE_SESSION_LENGTH = 5;
const ENABLE_PROGRESS_PERSISTENCE = true;

const BACK_BUTTON_STYLE = {
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

var TOP_BAR_HEIGHT = 56;

function GameTopMenu(props) {
  var user = props.user;
  var onProfiles = props.onProfiles;
  var onHome = props.onHome;
  var onLevels = props.onLevels;
  var onDashboard = props.onDashboard;
  var onSettings = props.onSettings;
  var onSignOut = props.onSignOut;

  var userLabel = user && (user.name || user.email) ? (user.name || user.email) : "פרופיל";
  var userInitial = userLabel && userLabel.length > 0 ? userLabel.charAt(0).toUpperCase() : "U";

  var menuBtn = {
    background: "white",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 999,
    padding: "0.35rem 0.85rem",
    cursor: "pointer",
    fontSize: "0.82rem",
    fontFamily: "'Secular One', sans-serif",
    color: "#111319",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: TOP_BAR_HEIGHT,
      zIndex: 250,
      display: "flex",
      alignItems: "center",
      direction: "rtl",
      padding: "0 1.2rem",
      background: "rgba(250,250,250,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button onClick={onProfiles} style={{ ...menuBtn, display: "flex", alignItems: "center", gap: "0.4rem", maxWidth: 200 }}>
          {user && user.image ? (
            <img
              src={user.image}
              alt={userLabel}
              style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(17,19,25,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.72rem",
            }}>{userInitial}</div>
          )}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userLabel}</span>
        </button>
        <button onClick={onHome} style={menuBtn}>בית</button>
        <button onClick={onLevels} style={menuBtn}>שלבים</button>
        <button onClick={onDashboard} style={menuBtn}>התקדמות</button>
        <button onClick={onSettings} style={menuBtn}>הגדרות</button>
      </div>

      <div style={{ flex: 1 }} />

      <button onClick={onSignOut} style={{
        background: "#111319",
        border: "none",
        borderRadius: 999,
        padding: "0.35rem 1rem",
        cursor: "pointer",
        fontSize: "0.82rem",
        fontFamily: "'Secular One', sans-serif",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}>התנתקות</button>
    </div>
  );
}

const HEBREW_LETTERS = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"];

const KEYBOARD_ROWS = {
  top: ["ק","ר","א","ט","ו","ן","ם","פ"],
  middle: ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
  bottom: ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"]
};

const NIKUD_MAP = {
  "\u05E7\u05B8\u05DE\u05B8\u05E5": "\u05B8",
  "\u05E4\u05B7\u05BC\u05EA\u05B8\u05D7": "\u05B7",
  "\u05D7\u05B4\u05D9\u05E8\u05B4\u05D9\u05E7": "\u05B4",
  "\u05E6\u05B5\u05D9\u05E8\u05B5\u05D9": "\u05B5",
  "\u05E1\u05B6\u05D2\u05BC\u05D5\u05B9\u05DC": "\u05B6",
  "\u05E9\u05C1\u05D5\u05BC\u05E8\u05D5\u05BC\u05E7": "\u05BC",
  "\u05D7\u05D5\u05B9\u05DC\u05B8\u05DD": "\u05B9",
  "\u05E7\u05D5\u05BC\u05D1\u05BC\u05D5\u05BC\u05E5": "\u05BB"
};

const FINAL_FORMS = { "\u05DB": "\u05DA", "\u05DE": "\u05DD", "\u05E0": "\u05DF", "\u05E4": "\u05E3", "\u05E6": "\u05E5" };

const KEY_TO_LETTER = {};
HEBREW_LETTERS.forEach(function(l) { KEY_TO_LETTER[l] = l; });
Object.entries(FINAL_FORMS).forEach(function(entry) { KEY_TO_LETTER[entry[1]] = entry[0]; });

const LETTER_NAMES = {
  "א": "אלף", "ב": "בית", "ג": "גימל", "ד": "דלת", "ה": "הא", "ו": "ואו",
  "ז": "זין", "ח": "חית", "ט": "טית", "י": "יוד", "כ": "כף", "ל": "למד",
  "מ": "מם", "נ": "נון", "ס": "סמך", "ע": "עין", "פ": "פא", "צ": "צדי",
  "ק": "קוף", "ר": "ריש", "ש": "שין", "ת": "תו"
};

const SUCCESS_MSGS = [
  "\u05DB\u05DC \u05D4\u05DB\u05D1\u05D5\u05D3! \uD83C\uDF89",
  "\u05DE\u05E2\u05D5\u05DC\u05D4! \u2B50",
  "\u05D9\u05D5\u05E4\u05D9! \uD83C\uDF1F",
  "\u05E0\u05D4\u05D3\u05E8! \uD83D\uDC4F",
  "\u05D0\u05EA \u05D0\u05DC\u05D5\u05E4\u05D4! \uD83C\uDFC6",
  "\u05D5\u05D0\u05D5! \uD83D\uDCAB"
];

const ERROR_MSGS = [
  "\u05DB\u05DE\u05E2\u05D8! \u05E0\u05E1\u05D9 \u05E9\u05D5\u05D1 \uD83D\uDCAA",
  "\u05E2\u05D5\u05D3 \u05E7\u05E6\u05EA! \uD83C\uDF08",
  "\u05DC\u05D0 \u05E0\u05D5\u05E8\u05D0, \u05E0\u05E1\u05D9 \u05E9\u05D5\u05D1! \uD83D\uDE0A",
  "\u05E7\u05E8\u05D5\u05D1! \uD83C\uDFAF"
];

/* ── Audio ── */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx && typeof window !== "undefined") {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(notes, vol, gap, dur) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  ctx.resume();
  notes.forEach(function(freq, i) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
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

function playSuccess() { playTone([523.25, 659.25, 783.99, 1046.5], 0.18, 0.1, 0.35); }
function playPerfect() { playTone([523.25, 659.25, 783.99, 1046.5, 1318.51], 0.12, 0.08, 0.4); }
function playError() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 220;
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function playClap() {
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

function stopPlayback() {
  _playbackId++;
  if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
}

function playRecording(name, pid) {
  return new Promise(function(resolve) {
    if (pid !== _playbackId) { resolve(); return; }
    var folder = _voiceGender === "female" ? "/recordings-female/" : "/recordings/";
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

function playRecordingSeq(names) {
  stopPlayback();
  var id = _playbackId;
  var chain = Promise.resolve();
  names.forEach(function(name) {
    chain = chain.then(function() { return playRecording(name, id); });
  });
  return chain;
}

function speakLetter(letter) {
  var base = KEY_TO_LETTER[letter] || letter;
  playRecordingSeq([base]);
}

/* ── Persistence ── */
function storageKey(base, profileId) {
  return profileId ? base + "-" + profileId : base;
}
function loadData(key, fallback) {
  if (!ENABLE_PROGRESS_PERSISTENCE) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveData(key, val) {
  if (!ENABLE_PROGRESS_PERSISTENCE) return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* noop */ }
}

/* ── Confetti ── */
function Confetti(props) {
  const active = props.active;
  const keyRef = useRef(0);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(function() {
    if (active) {
      keyRef.current += 1;
      setRenderKey(keyRef.current);
    }
  }, [active]);

  if (!active) return null;

  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      dur: 1.2 + Math.random() * 1,
      color: ["#FFD700","#FF6B9D","#00D4AA","#7C5CFC","#FF8C42","#45E3FF","#FF4757","#2ED573"][i % 8],
      size: 6 + Math.random() * 8,
      drift: -30 + Math.random() * 60
    });
  }

  const animName = "cfall" + renderKey;

  return (
    <div key={renderKey} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }}>
      {particles.map(function(p) {
        return (
          <div key={p.id} style={{
            position: "absolute",
            left: p.x + "%",
            top: "-5%",
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? "50%" : "2px",
            animation: animName + " " + p.dur + "s ease-in " + p.delay + "s forwards",
          }} />
        );
      })}
      <style>{
        "@keyframes " + animName + " { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }"
      }</style>
    </div>
  );
}

/* ── Progress Tracker ── */
function ProgressTracker(props) {
  var letterResults = props.letterResults;
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", padding: "0.5rem", maxWidth: "100%" }}>
      {letterResults.map(function(r, i) {
        var cur = r.status === "current";
        var perf = r.status === "perfect";
        var werr = r.status === "withErrors";
        var helped = r.status === "helpedPerfect" || r.status === "helpedWithErrors";
        var done = perf || werr || helped;

        var bg = "rgba(0,0,0,0.06)";
        var col = "#ccc";
        var bor = "2px solid transparent";
        var shd = "none";
        var sc = "scale(1)";
        var icon = r.letter;

        if (cur) {
          bg = "white"; col = "#E74C3C"; bor = "3px solid #E74C3C";
          shd = "0 0 12px rgba(231,76,60,0.3)"; sc = "scale(1.15)";
        } else if (perf) {
          bg = "linear-gradient(135deg,#27AE60,#2ECC71)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(39,174,96,0.3)";
        } else if (werr) {
          bg = "linear-gradient(135deg,#F39C12,#E67E22)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(243,156,18,0.3)";
        } else if (helped) {
          bg = "linear-gradient(135deg,#3498DB,#2980B9)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(52,152,219,0.3)";
        }

        return (
          <div key={i} style={{
            width: 100, height: 100, borderRadius: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: done ? "2.5rem" : "3rem",
            fontFamily: done ? "inherit" : "'Suez One', serif",
            fontWeight: cur ? "bold" : "normal",
            background: bg, color: col, border: bor, boxShadow: shd,
            transform: sc,
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            animation: cur ? "pulseDot 2s ease-in-out infinite" : (done ? "popIn 0.4s ease both" : "none"),
          }}>
            {icon}
          </div>
        );
      })}
      <style>{
        "@keyframes pulseDot { 0%,100%{ box-shadow: 0 0 12px rgba(231,76,60,0.3) } 50%{ box-shadow: 0 0 20px rgba(231,76,60,0.5) } }" +
        "@keyframes popIn { 0%{ transform: scale(0.5); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }"
      }</style>
    </div>
  );
}

/* ── Flipping Hint Card ── */
function FlippingHintCard(props) {
  var letter = props.letter;
  var onUseHelp = props.onUseHelp;
  var flipped = props.flipped;
  var setFlipped = props.setFlipped;

  function handleClick() {
    if (!flipped) {
      onUseHelp();
    }
    setFlipped(!flipped);
  }

  var imgSrc = "/letters/" + encodeURIComponent(letter) + ".jpg";

  return (
    <div style={{ perspective: 800, width: "clamp(6rem, 25vw, 12rem)", height: "clamp(6rem, 25vw, 12rem)" }}>
      <div onClick={handleClick} style={{
        width: "100%", height: "100%", position: "relative",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer"
      }}>
        {/* Front face */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          borderRadius: 18, background: "linear-gradient(135deg, #7C5CFC, #9B7DFF)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "0.3rem", color: "white",
          boxShadow: "0 3px 14px rgba(124,92,252,0.35)"
        }}>
          <span style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}>⌨️</span>
          <span style={{ fontSize: "clamp(0.9rem, 3vw, 1.3rem)", fontFamily: "'Secular One', sans-serif" }}>רמז</span>
        </div>
        {/* Back face */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: 18, overflow: "hidden",
          boxShadow: "0 3px 14px rgba(0,0,0,0.18)",
          background: "white"
        }}>
          <img src={imgSrc} alt={letter} style={{
            width: "100%", height: "100%", objectFit: "cover"
          }} />
        </div>
      </div>
    </div>
  );
}

/* ── Star rating ── */
function getStarsForAccuracy(accuracy) {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 1) return 1;
  return 0;
}

/* ── Settings defaults ── */
var DEFAULT_SETTINGS = {
  sessionLength: PRACTICE_SESSION_LENGTH,
  letterSet: HEBREW_LETTERS.slice(),
  nikud: false,
  nikudType: Object.keys(NIKUD_MAP)[0],
  helpLevel: "beginner",
  voiceGender: "male"
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN APP                                                                */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function LetterHunter() {
  var _s = useState("levels");     var screen = _s[0]; var setScreen = _s[1];

  // Active profile state (null = guest mode)
  var _ap = useState(function() { return loadData("lh-active-profile", null); });
  var activeProfile = _ap[0]; var setActiveProfile = _ap[1];
  var profileId = activeProfile ? activeProfile.id : null;

  var profilesHook = useProfiles();

  // Profile-scoped storage keys
  var skSettings = storageKey("lh-settings", profileId);
  var skSessions = storageKey("lh-sessions", profileId);
  var skLetterStats = storageKey("lh-letter-stats", profileId);
  var skLevelProgress = storageKey("lh-level-progress", profileId);

  var _se = useState(function() { return loadData(skSettings, DEFAULT_SETTINGS); });
  var settings = _se[0]; var setSettings = _se[1];
  var _ss = useState(function() { return loadData(skSessions, []); });
  var sessions = _ss[0]; var setSessions = _ss[1];
  var _ls = useState(function() { return loadData(skLetterStats, {}); });
  var letterStats = _ls[0]; var setLetterStats = _ls[1];
  var _lp = useState(function() { return loadData(skLevelProgress, { currentLevel: 1, levels: {} }); });
  var levelProgress = _lp[0]; var setLevelProgress = _lp[1];
  var _cgl = useState(null); var currentGameLevel = _cgl[0]; var setCurrentGameLevel = _cgl[1];

  var sync = useProgressSync(profileId);
  var hasPulledRef = useRef(false);
  var lastSyncedUserIdRef = useRef(null);

  // Reload data when profile changes
  useEffect(function() {
    var sk = storageKey("lh-settings", profileId);
    var ss = storageKey("lh-sessions", profileId);
    var sl = storageKey("lh-letter-stats", profileId);
    var sp = storageKey("lh-level-progress", profileId);
    setSettings(loadData(sk, DEFAULT_SETTINGS));
    setSessions(loadData(ss, []));
    setLetterStats(loadData(sl, {}));
    setLevelProgress(loadData(sp, { currentLevel: 1, levels: {} }));
    hasPulledRef.current = false;
    setScreen("levels");
  }, [profileId]);

  useEffect(function() { saveData(storageKey("lh-settings", profileId), settings); }, [settings, profileId]);
  useEffect(function() { _voiceGender = settings.voiceGender || "male"; }, [settings.voiceGender]);
  useEffect(function() { if (profileId) saveData(storageKey("lh-sessions", profileId), sessions); }, [sessions, profileId]);
  useEffect(function() { if (profileId) saveData(storageKey("lh-letter-stats", profileId), letterStats); }, [letterStats, profileId]);
  useEffect(function() { if (profileId) saveData(storageKey("lh-level-progress", profileId), levelProgress); }, [levelProgress, profileId]);

  // Persist active profile selection
  useEffect(function() { saveData("lh-active-profile", activeProfile); }, [activeProfile]);

  // Ensure selected profile belongs to current authenticated user
  useEffect(function() {
    if (!sync.isAuthenticated || !sync.user?.id) {
      lastSyncedUserIdRef.current = null;
      return;
    }

    var currentUserId = sync.user.id;
    if (lastSyncedUserIdRef.current !== currentUserId) {
      lastSyncedUserIdRef.current = currentUserId;
      setActiveProfile(null);
    }

    profilesHook.fetchProfiles().then(function(list) {
      if (!list || list.length === 0) return;
      setActiveProfile(function(prev) {
        if (prev && list.some(function(p) { return p.id === prev.id; })) return prev;
        return null;
      });
    });
  }, [sync.isAuthenticated, sync.user?.id, profilesHook.fetchProfiles]);

  // Sync settings to server when they change (debounced, skip initial load)
  var settingsInitRef = useRef(true);
  useEffect(function() {
    if (settingsInitRef.current) { settingsInitRef.current = false; return; }
    if (!sync.canSync) return;
    var timer = setTimeout(function() {
      sync.pushToServer({ settings: settings });
    }, 1000);
    return function() { clearTimeout(timer); };
  }, [settings, sync.canSync]);

  // Pull progress from server on first authenticated load with a profile
  useEffect(function() {
    if (!sync.canSync || hasPulledRef.current) return;
    hasPulledRef.current = true;
    sync.pullFromServer().then(function(serverData) {
      if (!serverData) return;
      if (serverData.settings) {
        setSettings(function(local) { return serverData.settings || local; });
      }
      if (serverData.levelProgress) {
        setLevelProgress(function(local) {
          var merged = { currentLevel: Math.max(local.currentLevel, serverData.levelProgress.currentLevel || 1), levels: {} };
          var allKeys = new Set(Object.keys(local.levels).concat(Object.keys(serverData.levelProgress.levels || {})));
          allKeys.forEach(function(k) {
            var loc = local.levels[k];
            var srv = (serverData.levelProgress.levels || {})[k];
            if (loc && srv) {
              merged.levels[k] = (srv.stars || 0) >= (loc.stars || 0) ? srv : loc;
            } else {
              merged.levels[k] = loc || srv;
            }
          });
          return merged;
        });
      }
      if (serverData.letterStats && Object.keys(serverData.letterStats).length > 0) {
        setLetterStats(function(local) {
          var merged = {};
          Object.keys(local).forEach(function(k) { merged[k] = local[k]; });
          Object.entries(serverData.letterStats).forEach(function(entry) {
            var k = entry[0]; var srv = entry[1];
            var loc = merged[k];
            if (!loc || (srv.attempts || 0) > (loc.attempts || 0)) {
              merged[k] = srv;
            }
          });
          return merged;
        });
      }
      if (serverData.sessions && serverData.sessions.length > 0) {
        setSessions(function(local) {
          var localIds = new Set(local.map(function(s) { return s.id; }));
          var newOnes = serverData.sessions.filter(function(s) { return !localIds.has(s.id); });
          return local.concat(newOnes);
        });
      }
    });
  }, [sync.canSync]);

  var _seq = useState([]); var sequence = _seq[0]; var setSequence = _seq[1];
  var _ci = useState(0); var currentIdx = _ci[0]; var setCurrentIdx = _ci[1];
  var _at = useState([]); var attempts = _at[0]; var setAttempts = _at[1];
  var _ce = useState(0); var currentErrors = _ce[0]; var setCurrentErrors = _ce[1];
  var _suc = useState(false); var showSuccess = _suc[0]; var setShowSuccess = _suc[1];
  var _err = useState(false); var showError = _err[0]; var setShowError = _err[1];
  var _em = useState(""); var errorMsg = _em[0]; var setErrorMsg = _em[1];
  var _lsa = useState(null); var letterShownAt = _lsa[0]; var setLetterShownAt = _lsa[1];
  var _sst = useState(null); var sessionStartTime = _sst[0]; var setSessionStartTime = _sst[1];
  var _lr = useState([]); var letterResults = _lr[0]; var setLetterResults = _lr[1];
  var _lpk = useState(null); var lastPressedKey = _lpk[0]; var setLastPressedKey = _lpk[1];
  var _uh = useState(false); var usedHelp = _uh[0]; var setUsedHelp = _uh[1];
  var _hf = useState(false); var hintFlipped = _hf[0]; var setHintFlipped = _hf[1];
  var _sd = useState(false); var speakDone = _sd[0]; var setSpeakDone = _sd[1];
  var _lw = useState(false); var showLangWarning = _lw[0]; var setShowLangWarning = _lw[1];

  var guestGameRef = useRef(false);
  var lastGameSessionRef = useRef(null);

  // Refs for event handler closure
  var stateRef = useRef({});
  stateRef.current = {
    showSuccess: showSuccess, currentIdx: currentIdx, sequence: sequence,
    currentErrors: currentErrors, letterShownAt: letterShownAt, attempts: attempts,
    usedHelp: usedHelp, hintFlipped: hintFlipped, currentGameLevel: currentGameLevel,
    isGuestGame: guestGameRef.current
  };

  function generateSequence(guest) {
    var pool = guest ? HEBREW_LETTERS.slice() : settings.letterSet.slice();
    if (pool.length === 0) pool = ["א"];
    var count = guest ? PRACTICE_SESSION_LENGTH : (settings.sessionLength || PRACTICE_SESSION_LENGTH);
    var seq = [];
    for (var i = 0; i < count; i++) {
      seq.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return seq;
  }

  function startGame(level, guest) {
    var ctx = getAudioCtx();
    if (ctx) ctx.resume();
    guestGameRef.current = !!guest;
    var seq = generateSequence(!!guest);
    setSequence(seq);
    setCurrentIdx(0);
    setAttempts([]);
    setCurrentErrors(0);
    setShowSuccess(false);
    setShowError(false);
    setLetterShownAt(Date.now());
    setSessionStartTime(Date.now());
    setLastPressedKey(null);
    setUsedHelp(false);
    setHintFlipped(false);
    setLetterResults(seq.map(function(l, i) { return { letter: l, status: i === 0 ? "current" : "pending" }; }));
    setCurrentGameLevel(level != null ? level : null);
    setScreen("game");
  }

  function finishSession(fa, seq, startTime, lr, gameLevel) {
    var correct = fa.filter(function(a) { return a.isCorrect; });
    var independentAttempts = fa.filter(function(a) { return !a.helped; });
    var independentCorrect = independentAttempts.filter(function(a) { return a.isCorrect; });
    var accuracy = independentAttempts.length > 0 ? Math.round((independentCorrect.length / independentAttempts.length) * 100) : 0;
    var sd = {
      id: Date.now(),
      date: new Date().toISOString(),
      mode: "random",
      totalQuestions: seq.length,
      completed: correct.length,
      accuracy: accuracy,
      avgTtc: independentCorrect.length > 0 ? Math.round(independentCorrect.reduce(function(s, a) { return s + a.ttc; }, 0) / independentCorrect.length) : 0,
      attempts: fa,
      sequence: seq.slice(),
      duration: Date.now() - startTime,
      letterResults: lr.slice(),
      level: gameLevel != null ? gameLevel : null
    };
    lastGameSessionRef.current = sd;

    if (guestGameRef.current) {
      setScreen("summary");
      return;
    }

    setSessions(function(prev) { return prev.concat([sd]); });

    var newLevelProgressForSync = null;
    if (gameLevel != null) {
      setLevelProgress(function(prev) {
        var newLevels = {};
        Object.keys(prev.levels).forEach(function(k) { newLevels[k] = prev.levels[k]; });
        newLevels[gameLevel] = {
          accuracy: accuracy,
          stars: getStarsForAccuracy(accuracy),
          completed: true
        };
        var newCurrentLevel = prev.currentLevel;
        if (gameLevel >= prev.currentLevel) {
          newCurrentLevel = gameLevel + 1;
        }
        var updated = { currentLevel: Math.min(newCurrentLevel, 1001), levels: newLevels };
        newLevelProgressForSync = updated;
        return updated;
      });
    }

    sync.pushSession({
      date: sd.date, mode: sd.mode, totalQuestions: sd.totalQuestions,
      completed: sd.completed, accuracy: sd.accuracy, avgTtc: sd.avgTtc,
      duration: sd.duration, attempts: sd.attempts, sequence: sd.sequence,
      letterResults: sd.letterResults, level: sd.level,
      letterStats: letterStats, levelProgress: newLevelProgressForSync,
    });

    setScreen("summary");
  }

  // Auto-speak letter when it changes
  useEffect(function() {
    if (screen !== "game") return;
    var currentLetter = sequence[currentIdx];
    if (!currentLetter) return;
    setSpeakDone(false);
    playRecordingSeq(["לחצי על האות", currentLetter]).then(function() {
      setSpeakDone(true);
    });
  }, [screen, currentIdx, sequence]);

  // Keyboard handler via ref to avoid stale closures
  useEffect(function() {
    if (screen !== "game") return;

    function handler(e) {
      e.preventDefault();
      var st = stateRef.current;
      if (st.showSuccess || st.currentIdx >= st.sequence.length) return;

      var pressedKey = e.key;

      // Spacebar toggles the hint card
      if (pressedKey === " ") {
        setHintFlipped(function(prev) {
          if (!prev) setUsedHelp(true);
          return !prev;
        });
        return;
      }

      var target = st.sequence[st.currentIdx];
      var baseLetter = KEY_TO_LETTER[pressedKey];

      setLastPressedKey(pressedKey);

      if (!baseLetter) {
        if (/^[a-zA-Z]$/.test(pressedKey)) {
          setShowLangWarning(true);
          return;
        }
        setErrorMsg("\u05D1\u05D5\u05D0\u05D9 \u05E0\u05D7\u05E4\u05E9 \u05D0\u05D5\u05EA! \uD83D\uDD0D");
        setShowError(true);
        setTimeout(function() { setShowError(false); }, 1200);
        return;
      }

      setShowLangWarning(false);

      var isCorrect = (baseLetter === target || pressedKey === target);
      var ttc = Date.now() - st.letterShownAt;
      var attempt = {
        letter: target, keyPressed: pressedKey, isCorrect: isCorrect,
        timestamp: Date.now(), ttc: ttc, helped: st.usedHelp
      };

      setAttempts(function(prev) { return prev.concat([attempt]); });

      if (isCorrect) {
        var isPerfect = st.currentErrors === 0;
        var wasHelped = st.usedHelp;
        if (isPerfect) playPerfect(); else playSuccess();
        playClap();
        setShowSuccess(true);

        var resultStatus;
        if (wasHelped) {
          resultStatus = isPerfect ? "helpedPerfect" : "helpedWithErrors";
        } else {
          resultStatus = isPerfect ? "perfect" : "withErrors";
        }

        setLetterResults(function(prev) {
          return prev.map(function(r, i) {
            if (i === st.currentIdx) return { letter: r.letter, status: resultStatus };
            if (i === st.currentIdx + 1) return { letter: r.letter, status: "current" };
            return r;
          });
        });

        // Only update letterStats if NOT helped
        if (!wasHelped) {
          setLetterStats(function(prev) {
            var s = prev[target] || { attempts: 0, correct: 0, totalTtc: 0, bestTtc: Infinity, lastPracticed: null };
            var updated = {};
            Object.keys(prev).forEach(function(k) { updated[k] = prev[k]; });
            updated[target] = {
              attempts: s.attempts + 1 + st.currentErrors,
              correct: s.correct + 1,
              totalTtc: s.totalTtc + ttc,
              bestTtc: Math.min(s.bestTtc, ttc),
              lastPracticed: new Date().toISOString()
            };
            return updated;
          });
        }

        var nextIdx = st.currentIdx + 1;
        var isLast = nextIdx >= st.sequence.length;

        setTimeout(function() {
          setShowSuccess(false);
          setCurrentErrors(0);
          setLastPressedKey(null);
          setUsedHelp(false);
          setHintFlipped(false);
          if (isLast) {
            // Need latest attempts - use functional approach
            setAttempts(function(latestAttempts) {
              setLetterResults(function(latestLR) {
                finishSession(latestAttempts, st.sequence, sessionStartTime, latestLR, st.currentGameLevel);
                return latestLR;
              });
              return latestAttempts;
            });
          } else {
            setCurrentIdx(nextIdx);
            setLetterShownAt(Date.now());
          }
        }, 1500);
      } else {
        playError();
        var wrongBase = KEY_TO_LETTER[pressedKey];
        playRecordingSeq(["בחרת ב", wrongBase]);
        var newErrors = st.currentErrors + 1;
        setCurrentErrors(newErrors);

        if (newErrors >= 3) {
          var rowEntry = Object.entries(KEYBOARD_ROWS).find(function(entry) { return entry[1].indexOf(target) >= 0; });
          var rowNames = { top: "\u05D4\u05E2\u05DC\u05D9\u05D5\u05E0\u05D4", middle: "\u05D4\u05D0\u05DE\u05E6\u05E2\u05D9\u05EA", bottom: "\u05D4\u05EA\u05D7\u05EA\u05D5\u05E0\u05D4" };
          var rn = rowEntry ? rowNames[rowEntry[0]] : "";
          setErrorMsg("\u05E8\u05DE\u05D6: \u05D7\u05E4\u05E9\u05D9 \u05D1\u05E9\u05D5\u05E8\u05D4 " + rn + "! \uD83D\uDCA1");
        } else {
          setErrorMsg(ERROR_MSGS[Math.floor(Math.random() * ERROR_MSGS.length)]);
        }
        setShowError(true);
        setTimeout(function() { setShowError(false); setLastPressedKey(null); }, 1200);
      }
    }

    window.addEventListener("keydown", handler);
    return function() { window.removeEventListener("keydown", handler); };
  }, [screen, sessionStartTime]);

  function openProfiles() { setScreen("profiles"); }
  function openHome() { setScreen("home"); }
  function openLevels() { setScreen("levels"); }
  function openDashboard() { setScreen("dashboard"); }
  function openSettings() { setScreen("settings"); }
  function handleSignOut() {
    setActiveProfile(null);
    signOut({ callbackUrl: "/play" });
  }

  function withTopMenu(content) {
    if (!sync.isAuthenticated) return content;
    return (
      <div style={{ paddingTop: TOP_BAR_HEIGHT }}>
        <GameTopMenu
          user={sync.user}
          onProfiles={openProfiles}
          onHome={openHome}
          onLevels={openLevels}
          onDashboard={openDashboard}
          onSettings={openSettings}
          onSignOut={handleSignOut}
        />
        {content}
      </div>
    );
  }

  /* ── Routing ── */

  // Authenticated without profile → force profile selection (except during game/summary)
  if (sync.isAuthenticated && !activeProfile && screen !== "game" && screen !== "summary" && screen !== "profiles") {
    return withTopMenu((
      <ProfileSelectionScreen
        profiles={profilesHook.profiles}
        loading={profilesHook.loading}
        onSelect={function(profile) { setActiveProfile(profile); setScreen("levels"); }}
        onCreateProfile={profilesHook.createProfile}
        onDeleteProfile={profilesHook.deleteProfile}
        onFetchProfiles={profilesHook.fetchProfiles}
        user={sync.user}
      />
    ));
  }
  if (screen === "profiles") {
    return withTopMenu((
      <ProfileSelectionScreen
        profiles={profilesHook.profiles}
        loading={profilesHook.loading}
        onSelect={function(profile) { setActiveProfile(profile); setScreen("levels"); }}
        onCreateProfile={profilesHook.createProfile}
        onDeleteProfile={profilesHook.deleteProfile}
        onFetchProfiles={profilesHook.fetchProfiles}
        user={sync.user}
      />
    ));
  }

  // Guest → show home landing (not levels)
  if (!sync.isAuthenticated && (screen === "levels" || screen === "home")) {
    return <HomeScreen onPlay={function() { startGame(null, true); }} onSettings={function() { setScreen("settings"); }} />;
  }

  if (screen === "levels" || screen === "home") {
    return withTopMenu((
      <LevelSelectionScreen
        levelProgress={levelProgress}
        onSelectLevel={function(level) { startGame(level); }}
        sessionLength={settings.sessionLength || PRACTICE_SESSION_LENGTH}
      />
    ));
  }
  if (screen === "game") {
    var gameBackScreen = guestGameRef.current ? "home" : "levels";
    var gameWrapper = guestGameRef.current ? function(c) { return c; } : withTopMenu;
    return gameWrapper((
      <GameScreen
        letter={sequence[currentIdx] || "א"}
        nikud={settings.nikud ? NIKUD_MAP[settings.nikudType] : null}
        showSuccess={showSuccess} showError={showError}
        errorMsg={errorMsg} helpLevel={settings.helpLevel}
        currentErrors={currentErrors} letterResults={letterResults}
        lastPressedKey={lastPressedKey}
        onBack={function() { setScreen(gameBackScreen); }}
        onSpeakLetter={function() { setUsedHelp(true); speakLetter(sequence[currentIdx] || "א"); }}
        onUseHelp={function() { setUsedHelp(true); }}
        hintFlipped={hintFlipped}
        setHintFlipped={setHintFlipped}
        currentGameLevel={currentGameLevel}
        speakDone={speakDone}
        showLangWarning={showLangWarning}
        onDismissLangWarning={function() { setShowLangWarning(false); }}
      />
    ));
  }
  if (screen === "summary") {
    var isGuest = guestGameRef.current;
    var lastSession = isGuest ? lastGameSessionRef.current : (sessions.length > 0 ? sessions[sessions.length - 1] : null);
    if (isGuest) {
      return (
        <SummaryScreen
          session={lastSession} letterResults={letterResults}
          onHome={function() { setScreen("home"); }}
          onPlayAgain={function() { startGame(null, true); }}
          isGuestGame={true}
        />
      );
    }
    return withTopMenu((
      <SummaryScreen
        session={lastSession} letterResults={letterResults}
        onHome={function() { setScreen("levels"); }}
        onPlayAgain={function() {
          if (currentGameLevel != null) {
            var nextLevel = currentGameLevel + 1;
            if (nextLevel <= 1000) {
              startGame(nextLevel);
            } else {
              setScreen("levels");
            }
          } else {
            startGame();
          }
        }}
        onLevels={function() { setScreen("levels"); }}
        currentGameLevel={currentGameLevel}
      />
    ));
  }
  if (screen === "dashboard") {
    return withTopMenu((
      <DashboardScreen
        sessions={sessions} letterStats={letterStats}
        onBack={function() { setScreen("levels"); }}
        onClearData={function() { setSessions([]); setLetterStats({}); setLevelProgress({ currentLevel: 1, levels: {} }); }}
      />
    ));
  }
  if (screen === "settings") {
    return withTopMenu((
      <SettingsScreen
        settings={settings} setSettings={setSettings}
        onBack={function() { setScreen("levels"); }}
      />
    ));
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  LEVEL SELECTION SCREEN                                                   */
/* ══════════════════════════════════════════════════════════════════════════ */
var LEVELS_PER_PAGE = 20;
var TOTAL_LEVELS = 1000;

function LevelSelectionScreen(props) {
  var levelProgress = props.levelProgress;
  var onSelectLevel = props.onSelectLevel;
  var sessionLength = props.sessionLength;
  var currentLevel = levelProgress && levelProgress.currentLevel ? levelProgress.currentLevel : 1;
  var completedCount = levelProgress && levelProgress.levels ? Object.keys(levelProgress.levels).length : 0;
  var levels = levelProgress && levelProgress.levels ? levelProgress.levels : {};

  var totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);
  var initialPage = Math.ceil(currentLevel / LEVELS_PER_PAGE);
  var _pg = useState(initialPage); var page = _pg[0]; var setPage = _pg[1];

  var startLevel = (page - 1) * LEVELS_PER_PAGE + 1;
  var endLevel = Math.min(page * LEVELS_PER_PAGE, TOTAL_LEVELS);
  var pageLevels = [];
  for (var i = startLevel; i <= endLevel; i++) pageLevels.push(i);

  function tileStyle(lvl) {
    var isCompleted = levels[lvl] && levels[lvl].completed;
    var isCurrent = lvl === currentLevel;
    var isLocked = lvl > currentLevel;
    var bg = isCurrent ? "#E74C3C" : isCompleted ? "#27AE60" : "rgba(0,0,0,0.05)";
    var color = (isCurrent || isCompleted) ? "white" : "rgba(0,0,0,0.25)";
    return {
      width: 52, height: 52, borderRadius: 14,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: bg, color: color,
      fontFamily: "'Secular One', sans-serif", fontSize: "1.1rem", fontWeight: 700,
      cursor: isLocked ? "default" : "pointer",
      boxShadow: isCurrent ? "0 4px 16px rgba(231,76,60,0.35)" : isCompleted ? "0 2px 8px rgba(39,174,96,0.2)" : "none",
      transition: "transform 0.15s",
      position: "relative",
    };
  }

  function starsFor(lvl) {
    var info = levels[lvl];
    if (!info || !info.stars) return null;
    var s = info.stars;
    return "⭐".repeat(Math.min(s, 3));
  }

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", fontFamily: "'Secular One', 'Rubik', sans-serif", paddingTop: "1.5rem" }}>
      <FloatingLettersBackground />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 1050, marginBottom: "0.8rem", zIndex: 2 }}>
        <a href="/" style={{
          fontFamily: "'Suez One', serif", fontSize: "1.2rem", color: "#111319",
          textDecoration: "none", letterSpacing: "-0.02em",
        }}>ציידת האותיות</a>
        <div />
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "'Suez One', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#111319", margin: "0 0 0.3rem", textAlign: "center", zIndex: 2 }}>
        שלבים
      </h1>
      <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.9rem", color: "rgba(17,19,25,0.45)", margin: "0 0 1.2rem", textAlign: "center", zIndex: 2 }}>
        עמוד {page} מתוך {totalPages}
      </p>

      {/* Levels grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 52px)",
        gap: 10,
        justifyContent: "center",
        width: "100%", maxWidth: 500,
        marginBottom: "1.2rem", zIndex: 2,
        direction: "ltr",
      }}>
        {pageLevels.map(function(lvl) {
          var isCompleted = levels[lvl] && levels[lvl].completed;
          var isCurrent = lvl === currentLevel;
          var isLocked = lvl > currentLevel;
          var stars = starsFor(lvl);
          return (
            <button
              key={lvl}
              onClick={isLocked ? undefined : function() { onSelectLevel(lvl); }}
              disabled={isLocked}
              style={tileStyle(lvl)}
            >
              {isLocked ? (
                <span style={{ fontSize: "1.2rem", opacity: 0.5 }}>🔒</span>
              ) : (
                <>
                  <span>{lvl}</span>
                  {stars ? <span style={{ fontSize: "0.45rem", marginTop: -2, letterSpacing: -1 }}>{stars}</span> : null}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", zIndex: 2 }}>
        <button
          onClick={function() { setPage(function(p) { return Math.max(1, p - 1); }); }}
          disabled={page <= 1}
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)",
            background: "white", cursor: page <= 1 ? "default" : "pointer",
            fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center",
            opacity: page <= 1 ? 0.3 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >←</button>
        <span style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.1rem", color: "#111319", minWidth: 60, textAlign: "center" }}>
          {totalPages} / {page}
        </span>
        <button
          onClick={function() { setPage(function(p) { return Math.min(totalPages, p + 1); }); }}
          disabled={page >= totalPages}
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)",
            background: "white", cursor: page >= totalPages ? "default" : "pointer",
            fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center",
            opacity: page >= totalPages ? 0.3 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >→</button>
      </div>

      {/* Info + play button */}
      <div style={{ width: "100%", maxWidth: 500, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.95rem", color: "rgba(17,19,25,0.55)", margin: "0 0 0.6rem", textAlign: "center" }}>
          בכל שלב תקבלו {sessionLength} אותיות רנדומליות. ההתקדמות נשמרת לפי הפרופיל המחובר.
        </p>
        <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.85rem", color: "rgba(17,19,25,0.4)", margin: "0 0 1rem", textAlign: "center" }}>
          שלבים שהושלמו: {completedCount}
        </p>
      </div>

      <button onClick={function() { onSelectLevel(currentLevel); }} style={{
        padding: "0.85rem 3rem", fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)", fontFamily: "'Secular One', sans-serif",
        background: "#111319", color: "white",
        border: "none", borderRadius: "999px", cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        marginBottom: "2rem", width: "100%", maxWidth: 420, zIndex: 2,
      }}>שחקי עכשיו!</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  PROFILE SELECTION SCREEN                                                */
/* ══════════════════════════════════════════════════════════════════════════ */
var AVATAR_OPTIONS = ["🧒","👧","👦","🧒🏻","👧🏻","👦🏻","🧒🏽","👧🏽","👦🏽","🐱","🦊","🐶","🐰","🦁","🐻","🦄","🐸","🐼"];

function ProfileSelectionScreen(props) {
  var profiles = props.profiles;
  var loading = props.loading;
  var onSelect = props.onSelect;
  var onCreateProfile = props.onCreateProfile;
  var onDeleteProfile = props.onDeleteProfile;
  var onFetchProfiles = props.onFetchProfiles;
  var user = props.user;

  var _sf = useState(false); var showForm = _sf[0]; var setShowForm = _sf[1];
  var _nm = useState(""); var newName = _nm[0]; var setNewName = _nm[1];
  var _av = useState("🧒"); var newAvatar = _av[0]; var setNewAvatar = _av[1];
  var _cr = useState(false); var creating = _cr[0]; var setCreating = _cr[1];
  var _cd = useState(null); var confirmDeleteId = _cd[0]; var setConfirmDeleteId = _cd[1];
  var hasFetched = useRef(false);

  useEffect(function() {
    if (!hasFetched.current) {
      hasFetched.current = true;
      onFetchProfiles();
    }
  }, []);

  function handleCreate() {
    if (!newName.trim() || creating) return;
    setCreating(true);
    onCreateProfile(newName.trim(), newAvatar).then(function(profile) {
      setCreating(false);
      if (profile) {
        setShowForm(false);
        setNewName("");
        setNewAvatar("🧒");
        onSelect(profile);
      }
    });
  }

  function handleDelete(id) {
    onDeleteProfile(id).then(function() {
      setConfirmDeleteId(null);
    });
  }

  return (
    <div style={{ ...PAGE_BG, fontFamily: "'Secular One', 'Rubik', sans-serif" }}>
      <FloatingLettersBackground />

      <h1 style={{ fontFamily: "'Suez One', serif", fontSize: "clamp(2rem, 7vw, 3rem)", color: "#111319", margin: "0 0 0.3rem", textAlign: "center", zIndex: 2 }}>
        מי משחק?
      </h1>
      <p style={{ fontSize: "1rem", color: "rgba(20,23,32,0.45)", marginBottom: "2rem", fontFamily: "'Rubik', sans-serif", zIndex: 2 }}>
        {user?.name || user?.email}
      </p>

      {loading ? (
        <div style={{ fontSize: "1.2rem", color: "#aaa", padding: "2rem" }}>טוען...</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", justifyContent: "center", maxWidth: 600, marginBottom: "2rem", zIndex: 2 }}>
          {profiles.map(function(profile) {
            return (
              <div key={profile.id} style={{ position: "relative" }}>
                <button
                  onClick={function() { onSelect(profile); }}
                  style={{
                    width: 130, minHeight: 140, borderRadius: 24,
                    border: "3px solid transparent", background: "white",
                    cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease", padding: "1rem 0.5rem",
                  }}
                  onMouseEnter={function(e) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.borderColor = "#7C5CFC"; }}
                  onMouseLeave={function(e) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <span style={{ fontSize: "3rem" }}>{profile.avatar}</span>
                  <span style={{ fontSize: "1.1rem", color: "#2C3E50", fontFamily: "'Secular One', sans-serif", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {profile.name}
                  </span>
                </button>
                {/* Delete button */}
                {confirmDeleteId === profile.id ? (
                  <div style={{ position: "absolute", top: -8, right: -8, display: "flex", gap: 4 }}>
                    <button onClick={function() { handleDelete(profile.id); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#E74C3C", color: "white", fontSize: "0.7rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>✓</button>
                    <button onClick={function() { setConfirmDeleteId(null); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#ccc", color: "white", fontSize: "0.7rem", cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={function(e) { e.stopPropagation(); setConfirmDeleteId(profile.id); }}
                    style={{
                      position: "absolute", top: -6, right: -6, width: 24, height: 24,
                      borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.1)",
                      color: "#999", fontSize: "0.65rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0.5, transition: "opacity 0.2s"
                    }}
                    onMouseEnter={function(e) { e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={function(e) { e.currentTarget.style.opacity = "0.5"; }}
                  >✕</button>
                )}
              </div>
            );
          })}

          {/* Add profile button */}
          <button
            onClick={function() { setShowForm(true); }}
            style={{
              width: 130, minHeight: 140, borderRadius: 24,
              border: "3px dashed rgba(124,92,252,0.3)", background: "rgba(255,255,255,0.5)",
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "0.5rem",
              transition: "all 0.2s ease", padding: "1rem 0.5rem",
            }}
            onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = "#7C5CFC"; }}
            onMouseLeave={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)"; }}
          >
            <span style={{ fontSize: "2.5rem", color: "#7C5CFC" }}>+</span>
            <span style={{ fontSize: "0.95rem", color: "#7C5CFC", fontFamily: "'Secular One', sans-serif" }}>פרופיל חדש</span>
          </button>
        </div>
      )}

      {/* Create profile form */}
      {showForm ? (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "1rem"
        }} onClick={function(e) { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{
            background: "white", borderRadius: 28, padding: "2rem",
            maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            animation: "popIn 0.3s ease both"
          }}>
            <h2 style={{ fontFamily: "'Suez One', serif", fontSize: "1.6rem", color: "#2C3E50", margin: "0 0 1.5rem", textAlign: "center" }}>
              פרופיל חדש
            </h2>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.4rem", display: "block", fontFamily: "'Secular One'" }}>שם</label>
              <input
                value={newName}
                onChange={function(e) { setNewName(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") handleCreate(); }}
                placeholder="הכניסו שם..."
                maxLength={30}
                autoFocus
                style={{
                  width: "100%", padding: "0.9rem 1rem", fontSize: "1.1rem",
                  border: "2px solid #e0e0e0", borderRadius: 14, outline: "none",
                  fontFamily: "'Rubik', sans-serif", direction: "rtl",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={function(e) { e.target.style.borderColor = "#7C5CFC"; }}
                onBlur={function(e) { e.target.style.borderColor = "#e0e0e0"; }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.4rem", display: "block", fontFamily: "'Secular One'" }}>אוואטר</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AVATAR_OPTIONS.map(function(av) {
                  return (
                    <button key={av} onClick={function() { setNewAvatar(av); }} style={{
                      width: 46, height: 46, borderRadius: 12, border: "none",
                      background: newAvatar === av ? "linear-gradient(135deg, #7C5CFC, #9B7DFF)" : "#f5f5f5",
                      fontSize: "1.5rem", cursor: "pointer", transition: "all 0.2s",
                      transform: newAvatar === av ? "scale(1.15)" : "scale(1)",
                      boxShadow: newAvatar === av ? "0 4px 12px rgba(124,92,252,0.3)" : "none"
                    }}>{av}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button onClick={handleCreate} disabled={!newName.trim() || creating} style={{
                flex: 1, padding: "0.9rem", fontSize: "1.1rem",
                fontFamily: "'Secular One'", border: "none", borderRadius: 16,
                cursor: newName.trim() && !creating ? "pointer" : "not-allowed",
                background: newName.trim() && !creating ? "linear-gradient(135deg, #7C5CFC, #5B3FD4)" : "#e0e0e0",
                color: "white", boxShadow: newName.trim() ? "0 4px 16px rgba(124,92,252,0.3)" : "none"
              }}>{creating ? "יוצר..." : "צרי פרופיל"}</button>
              <button onClick={function() { setShowForm(false); }} style={{
                padding: "0.9rem 1.5rem", fontSize: "1.1rem",
                fontFamily: "'Secular One'", border: "2px solid #e0e0e0",
                borderRadius: 16, cursor: "pointer", background: "white", color: "#999"
              }}>ביטול</button>
            </div>
          </div>
          <style>{"@keyframes popIn { 0%{ transform: scale(0.8); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }"}</style>
        </div>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  HOME SCREEN                                                             */
/* ══════════════════════════════════════════════════════════════════════════ */
function HomeScreen(props) {
  var onPlay = props.onPlay;
  var onSettings = props.onSettings;
  var _sp = useState(false); var showPlayPrompt = _sp[0]; var setShowPlayPrompt = _sp[1];

  return (
    <div style={{ ...PAGE_BG, fontFamily: "'Secular One', 'Rubik', sans-serif" }}>
      <FloatingLettersBackground />

      <h1 style={{ fontSize: "clamp(2.6rem, 5.8vw, 4.5rem)", fontFamily: "'Suez One', serif", color: "#111319", margin: "0 0 0.5rem", textAlign: "center", zIndex: 2, letterSpacing: "-0.04em" }}>ציידת האותיות</h1>
      <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "rgba(20,23,32,0.45)", fontFamily: "'Rubik', sans-serif", marginBottom: "2.5rem", zIndex: 2, textAlign: "center" }}>ללמוד את המקלדת דרך משחק קולי</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", zIndex: 2, width: "100%", maxWidth: 380 }}>
        <button onClick={function() { setShowPlayPrompt(true); }} style={{
          padding: "0.85rem 2.8rem", fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)", fontFamily: "'Secular One', sans-serif",
          background: "#111319", color: "white",
          border: "none", borderRadius: "999px", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          width: "100%", transition: "transform 0.2s, box-shadow 0.2s",
        }}>שחקי עכשיו!</button>

        <a href="/auth/signin?callbackUrl=%2Fplay" style={{
          padding: "0.75rem 2.8rem", fontSize: "clamp(0.95rem, 3vw, 1.15rem)", fontFamily: "'Secular One', sans-serif",
          background: "white", color: "#111319",
          border: "1px solid rgba(0,0,0,0.12)", borderRadius: "999px", cursor: "pointer",
          textDecoration: "none", textAlign: "center",
          width: "100%", boxSizing: "border-box",
        }}>התחברות</a>

        <a href="/auth/register?callbackUrl=%2Fplay" style={{
          fontSize: "0.9rem", color: "rgba(17,19,25,0.5)", fontFamily: "'Rubik', sans-serif",
          textDecoration: "underline", cursor: "pointer",
        }}>אין לך חשבון? הרשמה</a>
      </div>

      <button onClick={onSettings} style={{
        position: "absolute", bottom: "2rem", right: "2rem", width: 48, height: 48, borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.08)", background: "white", cursor: "pointer", fontSize: "1.2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", zIndex: 2,
      }}>⚙️</button>

      {showPlayPrompt ? (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }} onClick={function() { setShowPlayPrompt(false); }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "white", borderRadius: 24, padding: "2.2rem 2rem",
            textAlign: "center", direction: "rtl",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            maxWidth: 380, width: "90%",
            animation: "playPromptPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }} onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "0.6rem" }}>💾</div>
            <h2 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.25rem", color: "#111319", margin: "0 0 0.5rem" }}>רוצה לשמור את ההתקדמות?</h2>
            <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.9rem", color: "#888", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              התחברו כדי לשמור את הציונים, לעקוב אחרי ההתקדמות ולהמשיך מאיפה שעצרתם
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              <a href="/auth/signin?callbackUrl=%2Fplay" style={{
                padding: "0.75rem", fontSize: "1.05rem", fontFamily: "'Secular One', sans-serif",
                background: "#111319", color: "white", border: "none", borderRadius: 999,
                cursor: "pointer", textDecoration: "none", textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}>התחברות</a>
              <a href="/auth/register?callbackUrl=%2Fplay" style={{
                padding: "0.75rem", fontSize: "1.05rem", fontFamily: "'Secular One', sans-serif",
                background: "#7C5CFC", color: "white", border: "none", borderRadius: 999,
                cursor: "pointer", textDecoration: "none", textAlign: "center",
                boxShadow: "0 4px 12px rgba(124,92,252,0.3)",
              }}>הרשמה</a>
              <button onClick={function() { setShowPlayPrompt(false); onPlay(); }} style={{
                padding: "0.6rem", fontSize: "0.9rem", fontFamily: "'Rubik', sans-serif",
                background: "none", color: "#999", border: "none",
                cursor: "pointer", textDecoration: "underline",
              }}>רק לשחק בלי לשמור</button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{
        "@keyframes playPromptPop { 0%{ transform: translate(-50%,-50%) scale(0.8); opacity: 0 } 100%{ transform: translate(-50%,-50%) scale(1); opacity: 1 } }"
      }</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  GAME SCREEN                                                             */
/* ══════════════════════════════════════════════════════════════════════════ */
function GameScreen(props) {
  var letter = props.letter;
  var nikud = props.nikud;
  var showSuccess = props.showSuccess;
  var showError = props.showError;
  var errorMsg = props.errorMsg;
  var helpLevel = props.helpLevel;
  var currentErrors = props.currentErrors;
  var letterResults = props.letterResults;
  var lastPressedKey = props.lastPressedKey;
  var onBack = props.onBack;
  var onSpeakLetter = props.onSpeakLetter;
  var onUseHelp = props.onUseHelp;
  var hintFlipped = props.hintFlipped;
  var setHintFlipped = props.setHintFlipped;
  var currentGameLevel = props.currentGameLevel;
  var speakDone = props.speakDone;
  var showLangWarning = props.showLangWarning;
  var onDismissLangWarning = props.onDismissLangWarning;

  var displayLetter = nikud ? letter + nikud : letter;
  var successMsg = useMemo(function() {
    return SUCCESS_MSGS[Math.floor(Math.random() * SUCCESS_MSGS.length)];
  }, [showSuccess, letter]);



  var bgColor = showSuccess ? "#e8f8ef"
    : showError ? "#fef2f0"
    : "#fafafa";

  return (
    <div style={{
      minHeight: "100vh", background: bgColor,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Rubik', sans-serif", direction: "rtl", position: "relative",
      transition: "background 0.5s ease", overflow: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Secular+One&family=Rubik:wght@400;600;700&family=Suez+One&display=swap" rel="stylesheet" />

      <Confetti active={showSuccess} />

      <button onClick={onBack} style={BACK_BUTTON_STYLE}>← חזרה</button>

      {currentGameLevel != null ? (
        <div style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          background: "rgba(124,92,252,0.15)", borderRadius: 20,
          padding: "0.3rem 1rem", fontSize: "0.85rem", color: "#7C5CFC",
          fontWeight: "600", fontFamily: "'Secular One', sans-serif", zIndex: 10
        }}>
          שלב {currentGameLevel}
        </div>
      ) : null}

      <div style={{ position: "absolute", top: "1.5rem", width: "90%", display: "flex", justifyContent: "center" }}>
        <ProgressTracker letterResults={letterResults} />
      </div>

      {/* Wrong key floating indicator */}
      {showError && lastPressedKey && KEY_TO_LETTER[lastPressedKey] ? (
        <div style={{ position: "absolute", top: "28%", animation: "wrongKeyFloat 1.2s ease-out forwards" }}>
          <div style={{ fontSize: "3.5rem", fontFamily: "'Suez One', serif", color: "#E74C3C", opacity: 0.7, position: "relative" }}>
            {lastPressedKey}
            <div style={{ position: "absolute", top: "50%", left: "-10%", width: "120%", height: 4, background: "#E74C3C", borderRadius: 2, transform: "rotate(-45deg) translateY(-50%)" }} />
          </div>
        </div>
      ) : null}

      {/* Main letter */}
      <div style={{
        position: "relative", marginTop: "2rem",
        animation: showSuccess ? "successBounce 0.6s cubic-bezier(0.34,1.56,0.64,1)" : (showError ? "shakeAnim 0.5s ease" : "letterAppear 0.5s cubic-bezier(0.34,1.56,0.64,1)")
      }}>
        {showSuccess ? <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(39,174,96,0.2) 0%, transparent 70%)", animation: "glowPulse 0.8s ease-in-out infinite" }} /> : null}
        {showError ? <div style={{ position: "absolute", inset: -30, borderRadius: "50%", background: "radial-gradient(circle, rgba(231,76,60,0.15) 0%, transparent 70%)", animation: "errorFlash 0.5s ease-out" }} /> : null}

        <div style={{
          fontSize: "clamp(8rem, 35vw, 18rem)", fontFamily: "'Suez One', serif",
          color: showSuccess ? "#27AE60" : showError ? "#E74C3C" : "#2C3E50",
          lineHeight: 1, textAlign: "center", transition: "color 0.3s",
          filter: showSuccess ? "drop-shadow(0 0 40px rgba(39,174,96,0.4))" : showError ? "drop-shadow(0 0 20px rgba(231,76,60,0.2))" : "none"
        }}>
          {displayLetter}
        </div>

        {/* Speaker button — visible only after initial playback ends */}
        {speakDone && !showSuccess && !showError ? (
          <button onClick={onSpeakLetter} style={{
            position: "absolute", left: "-4.5rem", top: "50%", transform: "translateY(-50%)",
            width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer",
            fontSize: "1.8rem", background: "white",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s, opacity 0.3s",
            opacity: 1,
          }} title="הקראת האות">🔊</button>
        ) : null}

        {/* Keyboard hint card */}
        {!showSuccess && !showError ? (
          <div style={{ position: "absolute", right: "clamp(-15rem, -32vw, -8rem)", top: "50%", transform: "translateY(-50%)" }}>
            <FlippingHintCard letter={letter} onUseHelp={onUseHelp} flipped={hintFlipped} setFlipped={setHintFlipped} />
          </div>
        ) : null}
      </div>

      {/* Hint */}
      {!showSuccess && !showError ? (
        <p style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)", color: "#888", marginTop: "1.5rem", fontFamily: "'Secular One', sans-serif" }}>
          לחצי על האות: <strong style={{ color: "#E74C3C", fontSize: "130%" }}>{letter}</strong>
        </p>
      ) : null}


      {/* Error counter dots */}
      {currentErrors > 0 && !showSuccess ? (
        <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
          {[0, 1, 2].map(function(i) {
            return <div key={i} style={{
              width: 14, height: 14, borderRadius: "50%",
              background: i < currentErrors ? "#E74C3C" : "rgba(0,0,0,0.08)",
              transition: "all 0.3s",
              transform: i < currentErrors ? "scale(1.3)" : "scale(1)",
              boxShadow: i < currentErrors ? "0 0 8px rgba(231,76,60,0.4)" : "none"
            }} />;
          })}
        </div>
      ) : null}

      {/* Success message */}
      {showSuccess ? (
        <div style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", color: "#27AE60", fontFamily: "'Secular One', sans-serif", marginTop: "1rem", animation: "successBounce 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
          {successMsg}
        </div>
      ) : null}

      {/* Error message */}
      {showError ? (
        <div style={{
          fontSize: "clamp(1.2rem, 4vw, 1.8rem)", color: "#E74C3C",
          fontFamily: "'Secular One', sans-serif", animation: "errorSlideIn 0.3s ease",
          background: "rgba(255,255,255,0.95)", padding: "0.8rem 2rem",
          borderRadius: 20, boxShadow: "0 4px 20px rgba(231,76,60,0.15)",
          marginTop: "1rem", border: "2px solid rgba(231,76,60,0.2)"
        }}>
          {errorMsg}
        </div>
      ) : null}

      <style>{
        "@keyframes letterAppear { 0%{ transform: scale(0.3) rotate(-10deg); opacity: 0 } 100%{ transform: scale(1) rotate(0); opacity: 1 } }" +
        "@keyframes successBounce { 0%{ transform: scale(1) } 30%{ transform: scale(1.2) } 60%{ transform: scale(0.95) } 100%{ transform: scale(1) } }" +
        "@keyframes shakeAnim { 0%,100%{ transform: translateX(0) } 15%{ transform: translateX(-12px) } 30%{ transform: translateX(10px) } 45%{ transform: translateX(-8px) } 60%{ transform: translateX(6px) } }" +
        "@keyframes errorSlideIn { 0%{ transform: translateY(20px) scale(0.9); opacity: 0 } 100%{ transform: translateY(0) scale(1); opacity: 1 } }" +
        "@keyframes glowPulse { 0%,100%{ opacity: 0.5; transform: scale(1) } 50%{ opacity: 1; transform: scale(1.1) } }" +
        "@keyframes errorFlash { 0%{ opacity: 1; transform: scale(0.8) } 100%{ opacity: 0; transform: scale(1.5) } }" +
        "@keyframes wrongKeyFloat { 0%{ transform: translateY(0) scale(1); opacity: 0.8 } 100%{ transform: translateY(-80px) scale(0.4); opacity: 0 } }" +
        "@keyframes langWarnPop { 0%{ transform: translate(-50%,-50%) scale(0.8); opacity: 0 } 100%{ transform: translate(-50%,-50%) scale(1); opacity: 1 } }"
      }</style>

      {showLangWarning ? (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "white", borderRadius: 24, padding: "2rem 2.5rem",
            textAlign: "center", direction: "rtl",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            maxWidth: 340, width: "90%",
            animation: "langWarnPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>⌨️</div>
            <h2 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.3rem", color: "#111319", margin: "0 0 0.6rem" }}>המקלדת על אנגלית!</h2>
            <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.95rem", color: "#666", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
              שנו את שפת המקלדת לעברית ונסו שוב
            </p>
            <button onClick={onDismissLangWarning} style={{
              padding: "0.7rem 2.5rem", fontSize: "1rem", fontFamily: "'Secular One', sans-serif",
              background: "#111319", color: "white", border: "none", borderRadius: 999,
              cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>הבנתי</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  SUMMARY SCREEN                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */
function SummaryScreen(props) {
  var session = props.session;
  var lr = props.letterResults;
  var onHome = props.onHome;
  var onPlayAgain = props.onPlayAgain;
  var onLevels = props.onLevels;
  var currentGameLevel = props.currentGameLevel;
  var isGuestGame = props.isGuestGame;

  if (!session) return null;

  var ca = session.attempts.filter(function(a) { return a.isCorrect; });
  var res = session.letterResults || lr || [];
  var perfectCount = res.filter(function(r) { return r.status === "perfect"; }).length;
  var withErrorsCount = res.filter(function(r) { return r.status === "withErrors"; }).length;
  var helpedCount = res.filter(function(r) { return r.status === "helpedPerfect" || r.status === "helpedWithErrors"; }).length;
  var fastest = ca.length > 0 ? ca.reduce(function(a, b) { return a.ttc < b.ttc ? a : b; }) : null;
  var slowest = ca.length > 0 ? ca.reduce(function(a, b) { return a.ttc > b.ttc ? a : b; }) : null;

  // Recalculate accuracy excluding helped letters
  var independentAttempts = session.attempts.filter(function(a) {
    var letterRes = res.find(function(r) { return r.letter === a.letter && (r.status === "helpedPerfect" || r.status === "helpedWithErrors"); });
    return !letterRes;
  });
  var independentCorrect = independentAttempts.filter(function(a) { return a.isCorrect; });
  var realAccuracy = independentAttempts.length > 0 ? Math.round((independentCorrect.length / independentAttempts.length) * 100) : 0;
  var realAvgTtc = independentCorrect.length > 0 ? Math.round(independentCorrect.reduce(function(s, a) { return s + a.ttc; }, 0) / independentCorrect.length) : 0;

  return (
    <div style={PAGE_BG}>
      <FloatingLettersBackground />
      {currentGameLevel != null ? (
        <div style={{
          background: "#111319", borderRadius: 30, padding: "0.4rem 1.5rem",
          marginBottom: "0.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          fontSize: "1.1rem", color: "white", fontWeight: "600", fontFamily: "'Secular One', sans-serif", zIndex: 2,
        }}>
          שלב {currentGameLevel}
        </div>
      ) : null}
      <h1 style={{ fontFamily: "'Suez One', serif", fontSize: "clamp(1.8rem, 6vw, 2.8rem)", color: "#111319", marginBottom: "1.5rem", zIndex: 2 }}>סיכום משחק</h1>

      {/* Letter result strip */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem", maxWidth: 450, zIndex: 2 }}>
        {res.map(function(r, i) {
          var isHelped = r.status === "helpedPerfect" || r.status === "helpedWithErrors";
          var bg = r.status === "perfect" ? "linear-gradient(135deg, #27AE60, #2ECC71)" :
                   r.status === "withErrors" ? "linear-gradient(135deg, #F39C12, #E67E22)" :
                   isHelped ? "linear-gradient(135deg, #3498DB, #2980B9)" : "rgba(0,0,0,0.06)";
          var statusIcon = r.status === "perfect" ? "⭐" : r.status === "withErrors" ? "✓" : isHelped ? "👤" : "";
          return (
            <div key={i} style={{
              width: 44, height: 44, borderRadius: 12,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: bg,
              color: r.status === "pending" ? "#ccc" : "white",
              fontFamily: "'Suez One', serif", fontSize: "1.1rem",
              boxShadow: r.status !== "pending" ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              animation: "popIn 0.3s ease " + (i * 0.08) + "s both"
            }}>
              <span>{r.letter}</span>
              <span style={{ fontSize: "0.5rem", marginTop: -2 }}>
                {statusIcon}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem", maxWidth: 420, width: "100%", marginBottom: "1.5rem", zIndex: 2 }}>
        {[
          { label: "מושלם!", value: perfectCount, icon: "⭐", color: "#27AE60" },
          { label: "עם טעויות", value: withErrorsCount, icon: "💪", color: "#F39C12" },
          { label: "עם עזרה", value: helpedCount, icon: "👤", color: "#3498DB" },
          { label: "דיוק (עצמאי)", value: realAccuracy + "%", icon: "🎯", color: "#7C5CFC" },
          { label: "זמן ממוצע", value: realAvgTtc > 0 ? (realAvgTtc / 1000).toFixed(1) + "s" : "-", icon: "⏱️", color: "#E74C3C" }
        ].map(function(stat, i) {
          return (
            <div key={i} style={{
              background: "white", borderRadius: 20, padding: "1.2rem",
              textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              animation: "popIn 0.4s ease " + (0.3 + i * 0.1) + "s both"
            }}>
              <div style={{ fontSize: "1.5rem" }}>{stat.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "700", color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "0.85rem", color: "#999" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {fastest ? (
        <div style={{ background: "white", borderRadius: 16, padding: "1rem 2rem", maxWidth: 400, width: "100%", marginBottom: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", fontSize: "1rem", zIndex: 2 }}>
          <span>🚀 מהירה: <strong>{fastest.letter}</strong> ({(fastest.ttc / 1000).toFixed(1)}s)</span>
          <span>🐢 איטית: <strong>{slowest.letter}</strong> ({(slowest.ttc / 1000).toFixed(1)}s)</span>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1rem", zIndex: 2 }}>
        <button onClick={onPlayAgain} style={{ padding: "0.85rem 2.5rem", fontSize: "1.2rem", fontFamily: "'Secular One'", background: "#111319", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
          {isGuestGame ? "שחקי שוב!" : currentGameLevel != null ? "שלב " + (currentGameLevel + 1) + " ▶" : "שחקי שוב!"}
        </button>
        {!isGuestGame && currentGameLevel != null ? (
          <button onClick={onLevels} style={{ padding: "0.85rem 2rem", fontSize: "1.1rem", fontFamily: "'Secular One'", background: "white", color: "#111319", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "999px", cursor: "pointer" }}>שלבים</button>
        ) : null}
        <button onClick={onHome} style={{ padding: "0.85rem 2rem", fontSize: "1.1rem", fontFamily: "'Secular One'", background: "white", color: "#666", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "999px", cursor: "pointer" }}>
          {isGuestGame ? "מסך ראשי" : "שלבים"}
        </button>
      </div>

      <style>{
        "@keyframes popIn { 0%{ transform: scale(0.5); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }"
      }</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  DASHBOARD SCREEN                                                        */
/* ══════════════════════════════════════════════════════════════════════════ */
function DashboardScreen(props) {
  var sessions = props.sessions;
  var letterStats = props.letterStats;
  var onBack = props.onBack;
  var onClearData = props.onClearData;

  var _t = useState("overview"); var tab = _t[0]; var setTab = _t[1];
  var _cc = useState(false); var confirmClear = _cc[0]; var setConfirmClear = _cc[1];
  var recentSessions = sessions.slice().reverse().slice(0, 20);

  var hardestLetters = useMemo(function() {
    return Object.entries(letterStats).map(function(entry) {
      var l = entry[0]; var s = entry[1];
      return { letter: l, accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0, avgTtc: s.correct > 0 ? Math.round(s.totalTtc / s.correct) : 0 };
    }).sort(function(a, b) { return a.accuracy - b.accuracy; }).slice(0, 5);
  }, [letterStats]);

  var allLetterData = useMemo(function() {
    return Object.entries(letterStats).map(function(entry) {
      var l = entry[0]; var s = entry[1];
      return {
        letter: l, attempts: s.attempts, correct: s.correct,
        accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0,
        avgTtc: s.correct > 0 ? Math.round(s.totalTtc / s.correct) : 0,
        bestTtc: s.bestTtc === Infinity ? "-" : Math.round(s.bestTtc),
        lastPracticed: s.lastPracticed ? new Date(s.lastPracticed).toLocaleDateString("he-IL") : "-"
      };
    }).sort(function(a, b) { return HEBREW_LETTERS.indexOf(a.letter) - HEBREW_LETTERS.indexOf(b.letter); });
  }, [letterStats]);

  var accuracyOverTime = useMemo(function() {
    return sessions.slice(-15).map(function(s, i) {
      return { idx: i + 1, accuracy: s.accuracy, date: new Date(s.date).toLocaleDateString("he-IL", { day: "numeric", month: "numeric" }) };
    });
  }, [sessions]);

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <FloatingLettersBackground />

      <button onClick={onBack} style={BACK_BUTTON_STYLE}>← חזרה</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", width: "100%", maxWidth: 900, zIndex: 2 }}>
        <h1 style={{ fontFamily: "'Secular One'", fontSize: "1.5rem", color: "#111319", margin: 0 }}>התקדמות</h1>
      </div>

      <div style={{ background: "#FFF3CD", border: "1px solid #FFEEBA", borderRadius: 12, padding: "0.8rem 1.2rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#856404", zIndex: 2, width: "100%", maxWidth: 900, boxSizing: "border-box" }}>
        ⚠️ ודאו שהמקלדת מוגדרת על עברית
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", zIndex: 2 }}>
        {["overview", "letters", "sessions"].map(function(id) {
          var labels = { overview: "סקירה", letters: "אותיות", sessions: "סשנים" };
          return (
            <button key={id} onClick={function() { setTab(id); }} style={{
              padding: "0.6rem 1.5rem", borderRadius: 30, border: "none", cursor: "pointer",
              fontFamily: "'Secular One'", fontSize: "0.95rem",
              background: tab === id ? "#7C5CFC" : "white", color: tab === id ? "white" : "#666",
              boxShadow: tab === id ? "0 4px 12px rgba(124,92,252,0.3)" : "0 2px 8px rgba(0,0,0,0.05)"
            }}>{labels[id]}</button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" ? (
        sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#999", background: "white", borderRadius: 20, zIndex: 2, width: "100%", maxWidth: 900 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎮</div>
            <p style={{ fontSize: "1.2rem" }}>עדיין אין נתונים. שחקו משחק ראשון!</p>
          </div>
        ) : (
          <div style={{ zIndex: 2, width: "100%", maxWidth: 900 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem", marginBottom: "1.5rem" }}>
              {[
                { label: "סשנים", value: sessions.length, color: "#7C5CFC" },
                { label: "דיוק ממוצע", value: Math.round(sessions.reduce(function(s, x) { return s + x.accuracy; }, 0) / sessions.length) + "%", color: "#27AE60" },
                { label: "זמן ממוצע", value: (sessions.reduce(function(s, x) { return s + x.avgTtc; }, 0) / sessions.length / 1000).toFixed(1) + "s", color: "#E74C3C" }
              ].map(function(s, i) {
                return (
                  <div key={i} style={{ background: "white", borderRadius: 16, padding: "1rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: "700", color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "0.8rem", color: "#999" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>

            {accuracyOverTime.length > 1 ? (function() {
              var chartW = 100;
              var chartH = 120;
              var padL = 0;
              var padR = 0;
              var padT = 18;
              var padB = 22;
              var n = accuracyOverTime.length;
              var innerW = chartW - padL - padR;
              var innerH = chartH - padT - padB;
              var points = accuracyOverTime.map(function(d, i) {
                var x = padL + (n > 1 ? (i / (n - 1)) * innerW : innerW / 2);
                var y = padT + innerH - (d.accuracy / 100) * innerH;
                return { x: x, y: y, accuracy: d.accuracy, date: d.date };
              });
              var polyline = points.map(function(p) { return p.x + "," + p.y; }).join(" ");
              var areaPath = "M" + points[0].x + "," + (padT + innerH)
                + " " + points.map(function(p) { return "L" + p.x + "," + p.y; }).join(" ")
                + " L" + points[points.length - 1].x + "," + (padT + innerH) + " Z";
              return (
                <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 1rem", fontFamily: "'Secular One'", color: "#2C3E50", fontSize: "1rem" }}>דיוק לאורך זמן</h3>
                  <svg viewBox={"0 0 " + chartW + " " + chartH} style={{ width: "100%", height: "auto", overflow: "visible" }}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#lineGrad)" />
                    <polyline points={polyline} fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    {points.map(function(p, i) {
                      return (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="3" fill="#7C5CFC" stroke="white" strokeWidth="1.5" />
                          <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize="5" fill="#999">{p.accuracy}%</text>
                          <text x={p.x} y={padT + innerH + 10} textAnchor="middle" fontSize="4.5" fill="#bbb">{p.date}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })() : null}

            {hardestLetters.length > 0 ? (
              <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 1rem", fontFamily: "'Secular One'", color: "#2C3E50", fontSize: "1rem" }}>🔥 אותיות לעבוד עליהן</h3>
                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                  {hardestLetters.map(function(l, i) {
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#FFF5F5", borderRadius: 12, padding: "0.6rem 1rem" }}>
                        <span style={{ fontSize: "1.8rem", fontFamily: "'Suez One', serif" }}>{l.letter}</span>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#E74C3C" }}>{l.accuracy}%</div>
                          <div style={{ fontSize: "0.7rem", color: "#999" }}>{(l.avgTtc / 1000).toFixed(1)}s</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        )
      ) : null}

      {/* LETTERS TAB */}
      {tab === "letters" ? (
        <div style={{ background: "white", borderRadius: 20, padding: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflowX: "auto", zIndex: 2, width: "100%", maxWidth: 900, boxSizing: "border-box" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                {["אות", "ניסיונות", "נכון", "דיוק%", "זמן ממוצע", "שיא", "אחרון"].map(function(h) {
                  return <th key={h} style={{ padding: "0.7rem 0.5rem", textAlign: "center", color: "#999", fontWeight: "600" }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {allLetterData.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#ccc" }}>אין נתונים עדיין</td></tr>
              ) : allLetterData.map(function(l, i) {
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ textAlign: "center", fontSize: "1.4rem", fontFamily: "'Suez One', serif", padding: "0.5rem" }}>{l.letter}</td>
                    <td style={{ textAlign: "center" }}>{l.attempts}</td>
                    <td style={{ textAlign: "center" }}>{l.correct}</td>
                    <td style={{ textAlign: "center", fontWeight: "600", color: l.accuracy < 70 ? "#E74C3C" : "#27AE60" }}>{l.accuracy}%</td>
                    <td style={{ textAlign: "center" }}>{l.avgTtc > 0 ? (l.avgTtc / 1000).toFixed(1) + "s" : "-"}</td>
                    <td style={{ textAlign: "center" }}>{l.bestTtc !== "-" ? (l.bestTtc / 1000).toFixed(1) + "s" : "-"}</td>
                    <td style={{ textAlign: "center", fontSize: "0.75rem", color: "#999" }}>{l.lastPracticed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* SESSIONS TAB */}
      {tab === "sessions" ? (
        recentSessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#ccc", background: "white", borderRadius: 20, zIndex: 2, width: "100%", maxWidth: 900 }}>אין סשנים עדיין</div>
        ) : (
          <div style={{ zIndex: 2, width: "100%", maxWidth: 900 }}>
            {recentSessions.map(function(s, i) {
              var sResults = s.letterResults || s.sequence.map(function(l) { return { letter: l, status: "perfect" }; });
              return (
                <div key={i} style={{ background: "white", borderRadius: 16, padding: "1rem 1.5rem", marginBottom: "0.8rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "#999" }}>
                      {new Date(s.date).toLocaleDateString("he-IL")} {new Date(s.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#bbb" }}>אקראי</span>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontWeight: "600" }}>✅ {s.completed}/{s.totalQuestions}</span>
                    <span style={{ color: s.accuracy >= 70 ? "#27AE60" : "#E74C3C", fontWeight: "600" }}>🎯 {s.accuracy}%</span>
                    <span>⏱️ {(s.avgTtc / 1000).toFixed(1)}s</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: "0.5rem", flexWrap: "wrap" }}>
                    {sResults.map(function(r, j) {
                      var isHelped = r.status === "helpedPerfect" || r.status === "helpedWithErrors";
                      var bgc = r.status === "perfect" ? "#F0FFF0" : r.status === "withErrors" ? "#FFF8E1" : isHelped ? "#EBF5FB" : "#FFF5F5";
                      var clr = r.status === "perfect" ? "#27AE60" : r.status === "withErrors" ? "#F39C12" : isHelped ? "#3498DB" : "#E74C3C";
                      var brc = r.status === "perfect" ? "#C8E6C9" : r.status === "withErrors" ? "#FFE0B2" : isHelped ? "#AED6F1" : "#FFCDD2";
                      return <span key={j} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, fontSize: "0.9rem", fontFamily: "'Suez One', serif", background: bgc, color: clr, border: "1px solid " + brc }}>{r.letter}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : null}

      {/* Clear data */}
      <div style={{ textAlign: "center", marginTop: "2rem", zIndex: 2 }}>
        {!confirmClear ? (
          <button onClick={function() { setConfirmClear(true); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "0.85rem" }}>🗑️ מחק את כל הנתונים</button>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
            <span style={{ color: "#E74C3C", fontSize: "0.9rem" }}>בטוח?</span>
            <button onClick={function() { onClearData(); setConfirmClear(false); }} style={{ background: "#E74C3C", color: "white", border: "none", borderRadius: 8, padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.85rem" }}>כן, מחק</button>
            <button onClick={function() { setConfirmClear(false); }} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.85rem" }}>ביטול</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  SETTINGS SCREEN                                                         */
/* ══════════════════════════════════════════════════════════════════════════ */
function SettingsScreen(props) {
  var settings = props.settings;
  var setSettings = props.setSettings;
  var onBack = props.onBack;

  var _sl = useState(function() { return new Set(settings.letterSet); });
  var selectedLetters = _sl[0]; var setSelectedLetters = _sl[1];

  function updateSetting(key, value) {
    setSettings(function(prev) {
      var next = {};
      Object.keys(prev).forEach(function(k) { next[k] = prev[k]; });
      next[key] = value;
      return next;
    });
  }

  function toggleLetter(letter) {
    setSelectedLetters(function(prev) {
      var next = new Set(prev);
      if (next.has(letter)) {
        if (next.size > 1) next.delete(letter);
      } else {
        next.add(letter);
      }
      return next;
    });
  }

  function save() {
    setSettings(function(prev) {
      var next = {};
      Object.keys(prev).forEach(function(k) { next[k] = prev[k]; });
      next.letterSet = Array.from(selectedLetters);
      return next;
    });
    onBack();
  }

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <FloatingLettersBackground />

      <button onClick={onBack} style={BACK_BUTTON_STYLE}>← חזרה</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", width: "100%", maxWidth: 600, zIndex: 2 }}>
        <h1 style={{ fontFamily: "'Secular One'", fontSize: "1.5rem", color: "#111319", margin: 0 }}>הגדרות</h1>
      </div>

      {/* Session length */}
      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>אורך סשן</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[5, 10, 15].map(function(n) {
            return <button key={n} onClick={function() { updateSetting("sessionLength", n); }} style={{ flex: 1, padding: "0.7rem", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Secular One'", fontSize: "1.1rem", background: settings.sessionLength === n ? "#7C5CFC" : "#f0f0f0", color: settings.sessionLength === n ? "white" : "#666" }}>{n} שאלות</button>;
          })}
        </div>
      </div>

      {/* Voice gender */}
      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>קול</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[{ id: "male", label: "👦 קול גבר" }, { id: "female", label: "👧 קול אישה" }].map(function(v) {
            return <button key={v.id} onClick={function() { updateSetting("voiceGender", v.id); }} style={{ flex: 1, padding: "0.7rem", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Secular One'", fontSize: "1rem", background: settings.voiceGender === v.id ? "#7C5CFC" : "#f0f0f0", color: settings.voiceGender === v.id ? "white" : "#666" }}>{v.label}</button>;
          })}
        </div>
      </div>

      {/* Help level */}
      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>רמת עזרה</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[{ id: "beginner", label: "מתחילים (עם רמזים)" }, { id: "advanced", label: "מתקדמים (בלי רמזים)" }].map(function(h) {
            return <button key={h.id} onClick={function() { updateSetting("helpLevel", h.id); }} style={{ flex: 1, padding: "0.7rem", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Secular One'", fontSize: "0.85rem", background: settings.helpLevel === h.id ? "#7C5CFC" : "#f0f0f0", color: settings.helpLevel === h.id ? "white" : "#666" }}>{h.label}</button>;
          })}
        </div>
      </div>

      {/* Letter selection */}
      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <h3 style={{ margin: 0, fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>בחירת אותיות ({selectedLetters.size})</h3>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button onClick={function() { setSelectedLetters(new Set(HEBREW_LETTERS)); }} style={{ padding: "0.3rem 0.8rem", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "0.75rem", color: "#666" }}>הכל</button>
            <button onClick={function() { setSelectedLetters(new Set(HEBREW_LETTERS.slice(0, 5))); }} style={{ padding: "0.3rem 0.8rem", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "0.75rem", color: "#666" }}>5 ראשונות</button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HEBREW_LETTERS.map(function(l) {
            return <button key={l} onClick={function() { toggleLetter(l); }} style={{ width: 42, height: 42, borderRadius: 10, border: "none", cursor: "pointer", fontSize: "1.3rem", fontFamily: "'Suez One', serif", background: selectedLetters.has(l) ? "#7C5CFC" : "#f0f0f0", color: selectedLetters.has(l) ? "white" : "#999", transition: "all 0.2s" }}>{l}</button>;
          })}
        </div>
      </div>

      <button onClick={save} style={{ width: "100%", maxWidth: 600, padding: "0.85rem", fontSize: "1.2rem", fontFamily: "'Secular One'", background: "#111319", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.18)", zIndex: 2 }}>שמור הגדרות</button>
    </div>
  );
}
