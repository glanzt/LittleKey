"use client";

import { isArtworkComplete } from "@/lib/coloring-data";

var COLORING_STORAGE_PREFIX = "may-coloring";

export function getColoringProgressStorageKey(artworkId) {
  return COLORING_STORAGE_PREFIX + ":progress:" + artworkId + ":free";
}

export function loadColoringProgress(artworkId) {
  if (typeof window === "undefined") return {};
  try {
    var raw = window.localStorage.getItem(getColoringProgressStorageKey(artworkId));
    return raw ? JSON.parse(raw) : {};
  } catch (_error) {
    return {};
  }
}

export function saveColoringProgress(artworkId, filled) {
  if (typeof window === "undefined") return;
  try {
    if (!filled || Object.keys(filled).length === 0) {
      window.localStorage.removeItem(getColoringProgressStorageKey(artworkId));
      return;
    }
    window.localStorage.setItem(getColoringProgressStorageKey(artworkId), JSON.stringify(filled));
  } catch (_error) {}
}

export function clearColoringProgress(artworkId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getColoringProgressStorageKey(artworkId));
  } catch (_error) {}
}

export function clearAllColoringProgress(artworks) {
  if (typeof window === "undefined") return;
  artworks.forEach(function(artwork) {
    clearColoringProgress(artwork.id);
  });
}

export function getCompletedColoringIds(artworks) {
  var completedIds = new Set();
  artworks.forEach(function(artwork) {
    var filled = loadColoringProgress(artwork.id);
    if (isArtworkComplete(artwork.paths, filled)) completedIds.add(artwork.id);
  });
  return completedIds;
}

export function hasAnyColoringProgress(artworks) {
  return artworks.some(function(artwork) {
    var filled = loadColoringProgress(artwork.id);
    return Object.keys(filled).length > 0;
  });
}
