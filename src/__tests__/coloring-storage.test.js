import {
  getCompletedColoringIds,
  getColoringProgressStorageKey,
  loadColoringProgress,
  saveColoringProgress,
  clearColoringProgress,
} from "@/lib/coloring-storage";
import { COLORING_ARTWORKS } from "@/lib/coloring-data";

describe("coloring storage", function() {
  beforeEach(function() {
    window.localStorage.clear();
  });

  it("uses a MAY-specific namespaced key", function() {
    expect(getColoringProgressStorageKey("crown")).toBe("may-coloring:progress:crown:free");
  });

  it("persists and clears local coloring progress", function() {
    var filled = { base: 3, band: 3 };
    saveColoringProgress("crown", filled);

    expect(loadColoringProgress("crown")).toEqual(filled);

    clearColoringProgress("crown");
    expect(loadColoringProgress("crown")).toEqual({});
  });

  it("detects completed artworks from stored local progress", function() {
    var artwork = COLORING_ARTWORKS.find(function(entry) { return entry.id === "crown"; });
    var filled = {};
    artwork.paths.forEach(function(path) {
      filled[path.id] = path.colorId;
    });

    saveColoringProgress("crown", filled);

    expect(getCompletedColoringIds(COLORING_ARTWORKS).has("crown")).toBe(true);
  });
});
