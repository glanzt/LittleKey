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
    builtParts: [],
    pendingRevealPartId: null,
    pendingRevealKey: null,
    lastCompletionKey: null,
    startedAt: null,
  };
}

function sanitizeState(raw) {
  var initial = getDefaultState();
  if (!raw || typeof raw !== "object") return initial;
  var theme = raw.themeId ? THEMES_BY_ID[raw.themeId] : null;
  return {
    themeId: theme ? theme.id : null,
    builtParts: theme && Array.isArray(raw.builtParts)
      ? raw.builtParts.filter(function(partId) { return theme.parts.indexOf(partId) >= 0; })
      : [],
    pendingRevealPartId: theme && raw.pendingRevealPartId && theme.parts.indexOf(raw.pendingRevealPartId) >= 0
      ? raw.pendingRevealPartId
      : null,
    pendingRevealKey: typeof raw.pendingRevealKey === "string" ? raw.pendingRevealKey : null,
    lastCompletionKey: typeof raw.lastCompletionKey === "string" ? raw.lastCompletionKey : null,
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
      builtParts: state.builtParts,
      pendingRevealPartId: state.pendingRevealPartId,
      pendingRevealKey: state.pendingRevealKey,
      lastCompletionKey: state.lastCompletionKey,
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
  }, [storageKey, state.themeId, state.builtParts, state.pendingRevealPartId, state.pendingRevealKey, state.lastCompletionKey, state.startedAt]);

  function chooseTheme(themeId) {
    if (!THEMES_BY_ID[themeId]) return;
    setState({
      themeId: themeId,
      builtParts: [],
      pendingRevealPartId: null,
      pendingRevealKey: null,
      lastCompletionKey: null,
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

  function unlockForCompletion(completionKey) {
    if (!completionKey) return null;

    var unlockedPartId = null;
    setState(function(prev) {
      var theme = prev.themeId ? THEMES_BY_ID[prev.themeId] : null;
      if (!theme) return prev;
      if (prev.lastCompletionKey === completionKey) {
        return {
          themeId: prev.themeId,
          builtParts: prev.builtParts,
          pendingRevealPartId: prev.pendingRevealPartId,
          pendingRevealKey: prev.pendingRevealKey,
          lastCompletionKey: prev.lastCompletionKey,
          startedAt: prev.startedAt,
        };
      }

      var nextPartId = theme.parts[prev.builtParts.length] || null;
      unlockedPartId = nextPartId;
      return {
        themeId: prev.themeId,
        builtParts: nextPartId ? prev.builtParts.concat([nextPartId]) : prev.builtParts,
        pendingRevealPartId: nextPartId,
        pendingRevealKey: nextPartId ? completionKey : null,
        lastCompletionKey: completionKey,
        startedAt: prev.startedAt || Date.now(),
      };
    });
    return unlockedPartId;
  }

  function dismissReveal() {
    setState(function(prev) {
      if (!prev.pendingRevealPartId && !prev.pendingRevealKey) return prev;
      return {
        themeId: prev.themeId,
        builtParts: prev.builtParts,
        pendingRevealPartId: null,
        pendingRevealKey: null,
        lastCompletionKey: prev.lastCompletionKey,
        startedAt: prev.startedAt,
      };
    });
  }

  return {
    hasTheme: !!state.themeId,
    themeId: state.themeId,
    theme: state.themeId ? THEMES_BY_ID[state.themeId] : null,
    builtParts: state.builtParts,
    pendingRevealPartId: state.pendingRevealPartId,
    chooseTheme: chooseTheme,
    unlockForCompletion: unlockForCompletion,
    dismissReveal: dismissReveal,
    resetLoop: resetLoop,
    themes: BUILD_THEMES,
  };
}
