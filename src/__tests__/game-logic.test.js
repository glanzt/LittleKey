/**
 * Tests for game logic constants and pure functions extracted from letter-hunter.jsx.
 * These cover the core Hebrew keyboard mapping, letter names, final forms,
 * star ratings, and persistence helpers.
 */

const HEBREW_LETTERS = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"];

const KEYBOARD_ROWS = {
  top: ["ק","ר","א","ט","ו","ן","ם","פ"],
  middle: ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
  bottom: ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"],
};

const FINAL_FORMS = { "כ": "ך", "מ": "ם", "נ": "ן", "פ": "ף", "צ": "ץ" };

const KEY_TO_LETTER = {};
HEBREW_LETTERS.forEach((l) => { KEY_TO_LETTER[l] = l; });
Object.entries(FINAL_FORMS).forEach(([base, final]) => { KEY_TO_LETTER[final] = base; });

const LETTER_NAMES = {
  "א": "אלף", "ב": "בית", "ג": "גימל", "ד": "דלת", "ה": "הא", "ו": "ואו",
  "ז": "זין", "ח": "חית", "ט": "טית", "י": "יוד", "כ": "כף", "ל": "למד",
  "מ": "מם", "נ": "נון", "ס": "סמך", "ע": "עין", "פ": "פא", "צ": "צדי",
  "ק": "קוף", "ר": "ריש", "ש": "שין", "ת": "תו",
};

function getStarsForAccuracy(accuracy) {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 1) return 1;
  return 0;
}

function storageKey(base, profileId) {
  return profileId ? base + "-" + profileId : base;
}

// --- Tests ---

describe("Hebrew Letters", () => {
  it("contains exactly 22 letters", () => {
    expect(HEBREW_LETTERS).toHaveLength(22);
  });

  it("starts with alef and ends with tav", () => {
    expect(HEBREW_LETTERS[0]).toBe("א");
    expect(HEBREW_LETTERS[HEBREW_LETTERS.length - 1]).toBe("ת");
  });

  it("has no duplicates", () => {
    const unique = new Set(HEBREW_LETTERS);
    expect(unique.size).toBe(HEBREW_LETTERS.length);
  });
});

describe("Keyboard Layout", () => {
  it("top row has 8 keys", () => {
    expect(KEYBOARD_ROWS.top).toHaveLength(8);
  });

  it("middle row has 10 keys", () => {
    expect(KEYBOARD_ROWS.middle).toHaveLength(10);
  });

  it("bottom row has 9 keys", () => {
    expect(KEYBOARD_ROWS.bottom).toHaveLength(9);
  });

  it("all 22 base letters appear across the 3 rows (including via final forms)", () => {
    const allKeys = [...KEYBOARD_ROWS.top, ...KEYBOARD_ROWS.middle, ...KEYBOARD_ROWS.bottom];
    const mapped = allKeys.map((k) => KEY_TO_LETTER[k] || k);
    const unique = new Set(mapped);
    for (const letter of HEBREW_LETTERS) {
      expect(unique.has(letter)).toBe(true);
    }
  });

  it("each letter can be found on exactly one row", () => {
    const allKeys = [...KEYBOARD_ROWS.top, ...KEYBOARD_ROWS.middle, ...KEYBOARD_ROWS.bottom];
    const keySet = new Set(allKeys);
    expect(keySet.size).toBe(allKeys.length);
  });
});

describe("Final Forms (Sofit)", () => {
  it("maps 5 letters to their final forms", () => {
    expect(Object.keys(FINAL_FORMS)).toHaveLength(5);
  });

  it("maps כ → ך", () => expect(FINAL_FORMS["כ"]).toBe("ך"));
  it("maps מ → ם", () => expect(FINAL_FORMS["מ"]).toBe("ם"));
  it("maps נ → ן", () => expect(FINAL_FORMS["נ"]).toBe("ן"));
  it("maps פ → ף", () => expect(FINAL_FORMS["פ"]).toBe("ף"));
  it("maps צ → ץ", () => expect(FINAL_FORMS["צ"]).toBe("ץ"));
});

describe("KEY_TO_LETTER mapping", () => {
  it("maps every Hebrew letter to itself", () => {
    for (const letter of HEBREW_LETTERS) {
      expect(KEY_TO_LETTER[letter]).toBe(letter);
    }
  });

  it("maps final forms back to their base letter", () => {
    expect(KEY_TO_LETTER["ך"]).toBe("כ");
    expect(KEY_TO_LETTER["ם"]).toBe("מ");
    expect(KEY_TO_LETTER["ן"]).toBe("נ");
    expect(KEY_TO_LETTER["ף"]).toBe("פ");
    expect(KEY_TO_LETTER["ץ"]).toBe("צ");
  });

  it("returns undefined for non-Hebrew characters", () => {
    expect(KEY_TO_LETTER["a"]).toBeUndefined();
    expect(KEY_TO_LETTER["1"]).toBeUndefined();
  });
});

describe("Letter Names", () => {
  it("has a name for every Hebrew letter", () => {
    for (const letter of HEBREW_LETTERS) {
      expect(LETTER_NAMES[letter]).toBeDefined();
      expect(typeof LETTER_NAMES[letter]).toBe("string");
      expect(LETTER_NAMES[letter].length).toBeGreaterThan(0);
    }
  });

  it("maps specific letters correctly", () => {
    expect(LETTER_NAMES["א"]).toBe("אלף");
    expect(LETTER_NAMES["ש"]).toBe("שין");
    expect(LETTER_NAMES["ת"]).toBe("תו");
  });
});

describe("getStarsForAccuracy", () => {
  it("returns 3 stars for accuracy >= 90", () => {
    expect(getStarsForAccuracy(90)).toBe(3);
    expect(getStarsForAccuracy(95)).toBe(3);
    expect(getStarsForAccuracy(100)).toBe(3);
  });

  it("returns 2 stars for accuracy >= 70 and < 90", () => {
    expect(getStarsForAccuracy(70)).toBe(2);
    expect(getStarsForAccuracy(85)).toBe(2);
    expect(getStarsForAccuracy(89)).toBe(2);
  });

  it("returns 1 star for accuracy >= 1 and < 70", () => {
    expect(getStarsForAccuracy(1)).toBe(1);
    expect(getStarsForAccuracy(50)).toBe(1);
    expect(getStarsForAccuracy(69)).toBe(1);
  });

  it("returns 0 stars for accuracy 0", () => {
    expect(getStarsForAccuracy(0)).toBe(0);
  });

  it("handles edge case of negative accuracy", () => {
    expect(getStarsForAccuracy(-10)).toBe(0);
  });
});

describe("storageKey", () => {
  it("appends profileId when provided", () => {
    expect(storageKey("lh-settings", "p1")).toBe("lh-settings-p1");
  });

  it("returns base key when profileId is null", () => {
    expect(storageKey("lh-settings", null)).toBe("lh-settings");
  });

  it("returns base key when profileId is undefined", () => {
    expect(storageKey("lh-settings", undefined)).toBe("lh-settings");
  });

  it("returns base key when profileId is empty string", () => {
    expect(storageKey("lh-settings", "")).toBe("lh-settings");
  });
});

describe("Level System Constants", () => {
  const TOTAL_LEVELS = 1000;
  const LEVELS_PER_PAGE = 20;
  const TOTAL_PAGES = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

  it("has 1000 total levels", () => {
    expect(TOTAL_LEVELS).toBe(1000);
  });

  it("shows 20 levels per page", () => {
    expect(LEVELS_PER_PAGE).toBe(20);
  });

  it("has 50 pages", () => {
    expect(TOTAL_PAGES).toBe(50);
  });

  it("page calculation: level 1 is on page 0", () => {
    const page = Math.floor((1 - 1) / LEVELS_PER_PAGE);
    expect(page).toBe(0);
  });

  it("page calculation: level 20 is on page 0", () => {
    const page = Math.floor((20 - 1) / LEVELS_PER_PAGE);
    expect(page).toBe(0);
  });

  it("page calculation: level 21 is on page 1", () => {
    const page = Math.floor((21 - 1) / LEVELS_PER_PAGE);
    expect(page).toBe(1);
  });

  it("page calculation: level 1000 is on page 49", () => {
    const page = Math.floor((1000 - 1) / LEVELS_PER_PAGE);
    expect(page).toBe(49);
  });
});

describe("Level Unlock Logic", () => {
  function isLevelUnlocked(level, levelProgress) {
    if (level === 1) return true;
    const prevLevel = levelProgress.levels[level - 1];
    return prevLevel?.completed === true;
  }

  it("level 1 is always unlocked", () => {
    expect(isLevelUnlocked(1, { levels: {} })).toBe(true);
  });

  it("level 2 is locked when level 1 is not completed", () => {
    expect(isLevelUnlocked(2, { levels: {} })).toBe(false);
  });

  it("level 2 is unlocked when level 1 is completed", () => {
    expect(isLevelUnlocked(2, { levels: { 1: { completed: true } } })).toBe(true);
  });

  it("level 5 is locked when level 4 is incomplete", () => {
    expect(isLevelUnlocked(5, { levels: { 4: { completed: false } } })).toBe(false);
  });
});

describe("Accuracy Calculation", () => {
  function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }

  it("returns 100 for perfect score", () => {
    expect(calculateAccuracy(10, 10)).toBe(100);
  });

  it("returns 0 for no correct answers", () => {
    expect(calculateAccuracy(0, 10)).toBe(0);
  });

  it("returns 0 for empty session", () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

  it("rounds correctly", () => {
    expect(calculateAccuracy(1, 3)).toBe(33);
    expect(calculateAccuracy(2, 3)).toBe(67);
  });
});

describe("Allowed Avatars", () => {
  const ALLOWED_AVATARS = [
    "🧒","👧","👦","🧒🏻","👧🏻","👦🏻","🧒🏽","👧🏽","👦🏽",
    "🐱","🦊","🐶","🐰","🦁","🐻","🦄","🐸","🐼",
  ];

  it("contains 18 avatars", () => {
    expect(ALLOWED_AVATARS).toHaveLength(18);
  });

  it("includes human variants", () => {
    expect(ALLOWED_AVATARS).toContain("🧒");
    expect(ALLOWED_AVATARS).toContain("👧");
    expect(ALLOWED_AVATARS).toContain("👦");
  });

  it("includes animal variants", () => {
    expect(ALLOWED_AVATARS).toContain("🐱");
    expect(ALLOWED_AVATARS).toContain("🦄");
    expect(ALLOWED_AVATARS).toContain("🐼");
  });

  it("does not include invalid emojis", () => {
    expect(ALLOWED_AVATARS).not.toContain("🚀");
    expect(ALLOWED_AVATARS).not.toContain("💀");
  });
});
