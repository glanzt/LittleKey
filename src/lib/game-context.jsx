"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import useProgressSync from "@/hooks/useProgressSync";
import useProfiles from "@/hooks/useProfiles";
import {
  HEBREW_LETTERS, KEY_TO_LETTER, KEYBOARD_ROWS, NIKUD_MAP,
  PRACTICE_SESSION_LENGTH, TTC_OUTLIER_MS,
  DEFAULT_SETTINGS, ERROR_MSGS,
  getAudioCtx, playSuccess, playPerfect, playError, playClap,
  playRecordingSeq, speakLetter, setVoiceGender,
  storageKey, loadData, saveData, getStarsForAccuracy,
} from "@/lib/game-constants";

var GameContext = createContext(null);

export function GameProvider(props) {
  var children = props.children;
  var router = useRouter();
  var pathname = usePathname();

  var _ap = useState(function() { return loadData("lh-active-profile", null); });
  var activeProfile = _ap[0]; var setActiveProfile = _ap[1];
  var profileId = activeProfile ? activeProfile.id : null;

  var profilesHook = useProfiles();

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
  var letterStatsRef = useRef(letterStats);

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
  }, [profileId]);

  useEffect(function() { saveData(storageKey("lh-settings", profileId), settings); }, [settings, profileId]);
  useEffect(function() { setVoiceGender(settings.voiceGender || "male"); }, [settings.voiceGender]);
  useEffect(function() { if (profileId) saveData(storageKey("lh-sessions", profileId), sessions); }, [sessions, profileId]);
  useEffect(function() { if (profileId) saveData(storageKey("lh-letter-stats", profileId), letterStats); letterStatsRef.current = letterStats; }, [letterStats, profileId]);
  useEffect(function() { if (profileId) saveData(storageKey("lh-level-progress", profileId), levelProgress); }, [levelProgress, profileId]);
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

  // Sync settings to server (debounced, skip initial load)
  var settingsInitRef = useRef(true);
  useEffect(function() {
    if (settingsInitRef.current) { settingsInitRef.current = false; return; }
    if (!sync.canSync) return;
    var timer = setTimeout(function() {
      sync.pushToServer({ settings: settings });
    }, 1000);
    return function() { clearTimeout(timer); };
  }, [settings, sync.canSync]);

  // Sync letter stats to server (debounced, skip initial load)
  var letterStatsInitRef = useRef(true);
  useEffect(function() {
    if (letterStatsInitRef.current) { letterStatsInitRef.current = false; return; }
    if (!sync.canSync) return;
    var timer = setTimeout(function() {
      sync.pushToServer({ letterStats: letterStats });
    }, 2000);
    return function() { clearTimeout(timer); };
  }, [letterStats, sync.canSync]);

  // Sync level progress to server (debounced, skip initial load)
  var levelProgressInitRef = useRef(true);
  useEffect(function() {
    if (levelProgressInitRef.current) { levelProgressInitRef.current = false; return; }
    if (!sync.canSync) return;
    var timer = setTimeout(function() {
      sync.pushToServer({ levelProgress: levelProgress });
    }, 2000);
    return function() { clearTimeout(timer); };
  }, [levelProgress, sync.canSync]);

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
          if (!serverData.levelProgress) return local;
          var merged = { currentLevel: Math.max(local.currentLevel || 1, serverData.levelProgress.currentLevel || 1), levels: {} };
          var allKeys = new Set(Object.keys(local.levels || {}).concat(Object.keys(serverData.levelProgress.levels || {})));
          allKeys.forEach(function(k) {
            var localL = (local.levels || {})[k];
            var serverL = (serverData.levelProgress.levels || {})[k];
            if (localL && serverL) {
              merged.levels[k] = localL.stars >= serverL.stars ? localL : serverL;
            } else {
              merged.levels[k] = localL || serverL;
            }
          });
          return merged;
        });
      }
      if (serverData.letterStats) {
        setLetterStats(function(local) {
          var merged = {};
          var allLetters = new Set(Object.keys(local).concat(Object.keys(serverData.letterStats || {})));
          allLetters.forEach(function(l) {
            var a = local[l];
            var b = (serverData.letterStats || {})[l];
            if (a && b) {
              merged[l] = a.attempts >= b.attempts ? a : b;
            } else {
              merged[l] = a || b;
            }
          });
          return merged;
        });
      }
      if (serverData.sessions) {
        setSessions(function(local) {
          var localIds = new Set(local.map(function(s) { return s.id; }));
          var newOnes = serverData.sessions.filter(function(s) { return !localIds.has(s.id); });
          return local.concat(newOnes);
        });
      }
    });
  }, [sync.canSync, profileId]);

  /* ── Game State ── */
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
  var _gil = useState(false); var gameInputLocked = _gil[0]; var setGameInputLocked = _gil[1];

  var guestGameRef = useRef(false);
  var lastGameSessionRef = useRef(null);

  var stateRef = useRef({});
  stateRef.current = {
    showSuccess: showSuccess, currentIdx: currentIdx, sequence: sequence,
    currentErrors: currentErrors, letterShownAt: letterShownAt, attempts: attempts,
    usedHelp: usedHelp, hintFlipped: hintFlipped, currentGameLevel: currentGameLevel,
    isGuestGame: guestGameRef.current, gameInputLocked: gameInputLocked
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
    setGameInputLocked(false);
    setLetterResults(seq.map(function(l, i) { return { letter: l, status: i === 0 ? "current" : "pending" }; }));
    setCurrentGameLevel(level != null ? level : null);
    router.push("/play/game");
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
      avgTtc: (function() {
        var valid = independentCorrect.filter(function(a) { return a.ttc < TTC_OUTLIER_MS; });
        return valid.length > 0 ? Math.round(valid.reduce(function(s, a) { return s + a.ttc; }, 0) / valid.length) : 0;
      })(),
      attempts: fa,
      sequence: seq.slice(),
      duration: Date.now() - startTime,
      letterResults: lr.slice(),
      level: gameLevel != null ? gameLevel : null
    };
    lastGameSessionRef.current = sd;

    if (guestGameRef.current) {
      router.push("/play/summary");
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
      letterStats: letterStatsRef.current, levelProgress: newLevelProgressForSync,
    });

    router.push("/play/summary");
  }

  // Auto-speak letter when it changes (only on game page)
  useEffect(function() {
    if (pathname !== "/play/game") return;
    var currentLetter = sequence[currentIdx];
    if (!currentLetter) return;
    setSpeakDone(false);
    playRecordingSeq(["לחצי על האות", currentLetter]).then(function() {
      setSpeakDone(true);
    });
  }, [pathname, currentIdx, sequence]);

  function processGameKeyPress(pressedKey) {
    var st = stateRef.current;
    if (st.gameInputLocked || st.showSuccess || st.currentIdx >= st.sequence.length) return;

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

      if (!wasHelped) {
        setLetterStats(function(prev) {
          var s = prev[target] || { attempts: 0, correct: 0, totalTtc: 0, bestTtc: Infinity, lastPracticed: null };
          var updated = {};
          Object.keys(prev).forEach(function(k) { updated[k] = prev[k]; });
          var validTtc = ttc < TTC_OUTLIER_MS;
          updated[target] = {
            attempts: s.attempts + 1 + st.currentErrors,
            correct: s.correct + 1,
            totalTtc: validTtc ? s.totalTtc + ttc : s.totalTtc,
            bestTtc: validTtc ? Math.min(s.bestTtc, ttc) : s.bestTtc,
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

  // Keyboard handler (only on game page)
  useEffect(function() {
    if (pathname !== "/play/game") return;

    function handler(e) {
      e.preventDefault();
      processGameKeyPress(e.key);
    }

    window.addEventListener("keydown", handler);
    return function() { window.removeEventListener("keydown", handler); };
  }, [pathname, sessionStartTime]);

  function recordMatchSession(durationMs, details) {
    var info = details || {};
    var sd = {
      id: Date.now(),
      date: new Date().toISOString(),
      mode: "match",
      totalQuestions: info.totalQuestions != null ? info.totalQuestions : 0,
      completed: info.completed != null ? info.completed : 0,
      accuracy: 0,
      avgTtc: 0,
      duration: durationMs,
      attempts: [],
      sequence: [],
      letterResults: [],
      moves: info.moves != null ? info.moves : null,
      round: info.round != null ? info.round : null,
    };

    setSessions(function(prev) { return prev.concat([sd]); });

    sync.pushSession({
      date: sd.date,
      mode: sd.mode,
      totalQuestions: sd.totalQuestions,
      completed: sd.completed,
      accuracy: sd.accuracy,
      avgTtc: sd.avgTtc,
      duration: sd.duration,
      attempts: sd.attempts,
      sequence: sd.sequence,
      letterResults: sd.letterResults,
      moves: sd.moves,
      round: sd.round,
    });
  }

  function handleSignOut() {
    setActiveProfile(null);
    signOut({ callbackUrl: "/play" });
  }

  function clearAllData() {
    setSessions([]);
    setLetterStats({});
    setLevelProgress({ currentLevel: 1, levels: {} });
  }

  var value = {
    // Auth & profiles
    sync: sync,
    activeProfile: activeProfile,
    setActiveProfile: setActiveProfile,
    profilesHook: profilesHook,
    handleSignOut: handleSignOut,

    // Settings
    settings: settings,
    setSettings: setSettings,

    // Progress data
    sessions: sessions,
    letterStats: letterStats,
    levelProgress: levelProgress,
    clearAllData: clearAllData,

    // Game state
    sequence: sequence,
    currentIdx: currentIdx,
    currentGameLevel: currentGameLevel,
    showSuccess: showSuccess,
    showError: showError,
    errorMsg: errorMsg,
    currentErrors: currentErrors,
    letterResults: letterResults,
    lastPressedKey: lastPressedKey,
    usedHelp: usedHelp,
    hintFlipped: hintFlipped,
    setHintFlipped: setHintFlipped,
    setUsedHelp: setUsedHelp,
    speakDone: speakDone,
    showLangWarning: showLangWarning,
    setShowLangWarning: setShowLangWarning,
    gameInputLocked: gameInputLocked,
    setGameInputLocked: setGameInputLocked,
    isGuestGame: guestGameRef.current,
    lastGameSession: lastGameSessionRef.current,

    // Actions
    startGame: startGame,
    recordMatchSession: recordMatchSession,
    processGameKeyPress: processGameKeyPress,
    speakCurrentLetter: function() { setUsedHelp(true); speakLetter(sequence[currentIdx] || "א"); },

    // Navigation
    router: router,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  var ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
