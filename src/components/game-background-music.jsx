"use client";

import { useEffect } from "react";

var sharedAudio = null;
var activeConsumers = 0;
var stopTimer = null;
var interactionListenersAttached = false;

function ensureAudio() {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio("/api/game-music");
    sharedAudio.loop = true;
    sharedAudio.preload = "auto";
    sharedAudio.volume = 0.18;
  }
  return sharedAudio;
}

function detachInteractionListeners() {
  if (typeof window === "undefined" || !interactionListenersAttached) return;
  window.removeEventListener("pointerdown", attemptPlayFromInteraction);
  window.removeEventListener("keydown", attemptPlayFromInteraction);
  window.removeEventListener("touchstart", attemptPlayFromInteraction);
  interactionListenersAttached = false;
}

function attachInteractionListeners() {
  if (typeof window === "undefined" || interactionListenersAttached) return;
  window.addEventListener("pointerdown", attemptPlayFromInteraction, { passive: true });
  window.addEventListener("keydown", attemptPlayFromInteraction);
  window.addEventListener("touchstart", attemptPlayFromInteraction, { passive: true });
  interactionListenersAttached = true;
}

function attemptPlayFromInteraction() {
  var audio = ensureAudio();
  if (!audio) return;

  audio.play().then(function() {
    detachInteractionListeners();
  }).catch(function() {
    attachInteractionListeners();
  });
}

export function GameBackgroundMusic() {
  useEffect(function() {
    var audio = ensureAudio();
    if (!audio) return;

    activeConsumers += 1;
    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }

    attemptPlayFromInteraction();

    return function() {
      activeConsumers = Math.max(0, activeConsumers - 1);
      if (activeConsumers > 0) return;

      stopTimer = setTimeout(function() {
        if (activeConsumers > 0 || !sharedAudio) return;
        sharedAudio.pause();
        sharedAudio.currentTime = 0;
        detachInteractionListeners();
      }, 180);
    };
  }, []);

  return null;
}
