export var DEFAULT_FEELING_NAMES = [
  "בוכה",
  "חושב",
  "כועס",
  "מחייך",
  "מבולבל",
  "מופתע",
  "מתרגש",
  "מפחד",
  "נבוך",
  "עייף",
  "עירני",
  "עצוב",
  "יצירתי",
  "ישן",
  "שמח",
];

export var FEELING_AUDIO_OVERRIDES = {
  "עירני": "עירוני",
};

export var DEFAULT_FEELING_ITEMS = DEFAULT_FEELING_NAMES.map(function(name) {
  return {
    id: name,
    label: name,
    imageSrc: "/api/feelings?type=image&name=" + encodeURIComponent(name),
    audioName: FEELING_AUDIO_OVERRIDES[name] || name,
  };
});

export function shuffleArray(items) {
  var copy = items.slice();
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export function pickRandomFeelings(items, count) {
  var pool = Array.isArray(items) ? items.slice() : [];
  if (pool.length === 0) return [];
  var limit = Math.max(1, Math.min(count || pool.length, pool.length));
  return shuffleArray(pool).slice(0, limit);
}

export function normalizeFeelingItems(items) {
  if (!Array.isArray(items) || items.length === 0) return DEFAULT_FEELING_ITEMS.slice();

  return items
    .filter(function(item) {
      return item && item.id && item.imageSrc;
    })
    .map(function(item) {
      return {
        id: item.id,
        label: item.label || item.id,
        imageSrc: item.imageSrc,
        audioName: item.audioName || FEELING_AUDIO_OVERRIDES[item.id] || item.id,
      };
    });
}

export async function fetchFeelingItems() {
  if (typeof window === "undefined") return DEFAULT_FEELING_ITEMS.slice();

  try {
    var response = await fetch("/api/feelings", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load feelings");
    var data = await response.json();
    return normalizeFeelingItems(data.items);
  } catch (error) {
    return DEFAULT_FEELING_ITEMS.slice();
  }
}
