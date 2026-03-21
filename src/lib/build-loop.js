"use client";

import { useEffect, useMemo, useState } from "react";

export var BUILD_THEMES = [
  {
    id: "garden",
    label: "גינה",
    icon: "🌸",
    parts: ["pot", "sprout", "flowerPink", "flowerYellow", "butterfly", "tree", "sun", "rainbow"],
  },
  {
    id: "space",
    label: "חלל",
    icon: "🚀",
    parts: ["planet", "rocketBody", "rocketWindow", "rocketFinLeft", "rocketFinRight", "flame", "moon", "star"],
  },
  {
    id: "house",
    label: "בית",
    icon: "🏠",
    parts: ["walls", "roof", "door", "window", "chimney", "smoke", "tree", "flower"],
  },
];

var THEMES_BY_ID = BUILD_THEMES.reduce(function(acc, theme) {
  acc[theme.id] = theme;
  return acc;
}, {});

function getStorageKey(gameKey, profileId) {
  return "lh-build-loop-session-" + (profileId || "guest") + "-" + gameKey;
}

function getDefaultState() {
  return {
    themeId: null,
    progress: 0,
    builtParts: [],
    justUnlockedPartId: null,
    showNudge: false,
    startedAt: null,
  };
}

function sanitizeState(raw) {
  var initial = getDefaultState();
  if (!raw || typeof raw !== "object") return initial;
  var theme = raw.themeId ? THEMES_BY_ID[raw.themeId] : null;
  return {
    themeId: theme ? theme.id : null,
    progress: raw.progress === 1 || raw.progress === 2 ? raw.progress : 0,
    builtParts: theme && Array.isArray(raw.builtParts)
      ? raw.builtParts.filter(function(partId) { return theme.parts.indexOf(partId) >= 0; })
      : [],
    justUnlockedPartId: null,
    showNudge: false,
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : null,
  };
}

function loadSessionState(storageKey) {
  if (typeof window === "undefined") return getDefaultState();
  try {
    var raw = window.sessionStorage.getItem(storageKey);
    return raw ? sanitizeState(JSON.parse(raw)) : getDefaultState();
  } catch (error) {
    return getDefaultState();
  }
}

function saveSessionState(storageKey, state) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify({
      themeId: state.themeId,
      progress: state.progress,
      builtParts: state.builtParts,
      startedAt: state.startedAt,
    }));
  } catch (error) {
    /* noop */
  }
}

export function useBuildLoop(gameKey, profileId) {
  var storageKey = useMemo(function() {
    return getStorageKey(gameKey, profileId);
  }, [gameKey, profileId]);

  var _state = useState(function() {
    return loadSessionState(storageKey);
  });
  var state = _state[0];
  var setState = _state[1];

  useEffect(function() {
    setState(loadSessionState(storageKey));
  }, [storageKey]);

  useEffect(function() {
    saveSessionState(storageKey, state);
  }, [storageKey, state.themeId, state.progress, state.builtParts, state.startedAt]);

  useEffect(function() {
    if (!state.justUnlockedPartId && !state.showNudge) return;
    var timer = setTimeout(function() {
      setState(function(prev) {
        if (!prev.justUnlockedPartId && !prev.showNudge) return prev;
        return {
          themeId: prev.themeId,
          progress: prev.progress,
          builtParts: prev.builtParts,
          justUnlockedPartId: null,
          showNudge: false,
          startedAt: prev.startedAt,
        };
      });
    }, 1800);
    return function() { clearTimeout(timer); };
  }, [state.justUnlockedPartId, state.showNudge]);

  function chooseTheme(themeId) {
    if (!THEMES_BY_ID[themeId]) return;
    setState({
      themeId: themeId,
      progress: 0,
      builtParts: [],
      justUnlockedPartId: null,
      showNudge: false,
      startedAt: Date.now(),
    });
  }

  function resetLoop() {
    var nextState = getDefaultState();
    setState(nextState);
    if (typeof window !== "undefined") {
      try { window.sessionStorage.removeItem(storageKey); } catch (error) { /* noop */ }
    }
  }

  function registerSuccess() {
    setState(function(prev) {
      var theme = prev.themeId ? THEMES_BY_ID[prev.themeId] : null;
      if (!theme) return prev;

      var nextProgress = prev.progress + 1;
      if (nextProgress < 3) {
        return {
          themeId: prev.themeId,
          progress: nextProgress,
          builtParts: prev.builtParts,
          justUnlockedPartId: null,
          showNudge: false,
          startedAt: prev.startedAt || Date.now(),
        };
      }

      var nextPartId = theme.parts[prev.builtParts.length] || null;
      return {
        themeId: prev.themeId,
        progress: 0,
        builtParts: nextPartId ? prev.builtParts.concat([nextPartId]) : prev.builtParts,
        justUnlockedPartId: nextPartId,
        showNudge: true,
        startedAt: prev.startedAt || Date.now(),
      };
    });
  }

  return {
    hasTheme: !!state.themeId,
    themeId: state.themeId,
    theme: state.themeId ? THEMES_BY_ID[state.themeId] : null,
    progress: state.progress,
    builtParts: state.builtParts,
    justUnlockedPartId: state.justUnlockedPartId,
    showNudge: state.showNudge,
    chooseTheme: chooseTheme,
    registerSuccess: registerSuccess,
    resetLoop: resetLoop,
    themes: BUILD_THEMES,
  };
}
