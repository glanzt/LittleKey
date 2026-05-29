// Data model for the "ללמוד את האלף בית" game.
//
// The top rail shows the full 22-letter base alphabet (sofit forms excluded,
// since words don't start with them). Each letter holds ~10 single-correct
// multiple-choice questions, mixing two formats:
//   - type 'picture': pick the emoji whose word starts with the target letter
//   - type 'word':    pick the written word that starts with the target letter
//
// Only letters that have a `questions` array are playable; the rest render in
// the rail as "coming soon" and stay locked.

export const ALPHABET = [
  { letter: "א", name: "אָלֶף" },
  { letter: "ב", name: "בֵּית" },
  { letter: "ג", name: "גִימֶל" },
  { letter: "ד", name: "דָלֶת" },
  { letter: "ה", name: "הֵא" },
  { letter: "ו", name: "וָו" },
  { letter: "ז", name: "זַיִן" },
  { letter: "ח", name: "חֵית" },
  { letter: "ט", name: "טֵית" },
  { letter: "י", name: "יוֹד" },
  { letter: "כ", name: "כָּף" },
  { letter: "ל", name: "לָמֶד" },
  { letter: "מ", name: "מֵם" },
  { letter: "נ", name: "נוּן" },
  { letter: "ס", name: "סָמֶךְ" },
  { letter: "ע", name: "עַיִן" },
  { letter: "פ", name: "פֵּא" },
  { letter: "צ", name: "צָדִי" },
  { letter: "ק", name: "קוֹף" },
  { letter: "ר", name: "רֵישׁ" },
  { letter: "ש", name: "שִׁין" },
  { letter: "ת", name: "תָו" },
];

// Build a single-correct question. `correct` and each distractor are plain
// objects: { emoji?, label }. The first option is flagged correct; the card
// shuffles display order at render time.
function q(id, type, correct, distractors) {
  return {
    id,
    type,
    options: [{ ...correct, correct: true }].concat(
      distractors.map(function (d) {
        return { ...d, correct: false };
      }),
    ),
  };
}

const QUESTIONS = {
  א: [
    q("a-p1", "picture", { emoji: "🦁", label: "אריה" }, [
      { emoji: "🐶", label: "כלב" },
      { emoji: "🐟", label: "דג" },
      { emoji: "🐱", label: "חתול" },
    ]),
    q("a-w1", "word", { label: "אבא" }, [
      { label: "דג" },
      { label: "מים" },
      { label: "גן" },
    ]),
    q("a-p2", "picture", { emoji: "🚗", label: "אוטו" }, [
      { emoji: "🏠", label: "בית" },
      { emoji: "🌸", label: "פרח" },
      { emoji: "☀️", label: "שמש" },
    ]),
    q("a-w2", "word", { label: "אמא" }, [
      { label: "בית" },
      { label: "כלב" },
      { label: "ספר" },
    ]),
    q("a-p3", "picture", { emoji: "🦆", label: "אווז" }, [
      { emoji: "🐴", label: "סוס" },
      { emoji: "🐵", label: "קוף" },
      { emoji: "🧸", label: "דובי" },
    ]),
    q("a-w3", "word", { label: "אוזן" }, [
      { label: "רגל" },
      { label: "יד" },
      { label: "פה" },
    ]),
    q("a-p4", "picture", { emoji: "🍉", label: "אבטיח" }, [
      { emoji: "🍌", label: "בננה" },
      { emoji: "🍎", label: "תפוח" },
      { emoji: "🥕", label: "גזר" },
    ]),
    q("a-w4", "word", { label: "ארגז" }, [
      { label: "שולחן" },
      { label: "ספר" },
      { label: "כוס" },
    ]),
    q("a-p5", "picture", { emoji: "🍍", label: "אננס" }, [
      { emoji: "🍋", label: "לימון" },
      { emoji: "☁️", label: "ענן" },
      { emoji: "🚆", label: "רכבת" },
    ]),
    q("a-w5", "word", { label: "אש" }, [
      { label: "מים" },
      { label: "רוח" },
      { label: "עץ" },
    ]),
  ],
  ב: [
    q("b-p1", "picture", { emoji: "🏠", label: "בית" }, [
      { emoji: "🌳", label: "עץ" },
      { emoji: "🐴", label: "סוס" },
      { emoji: "🌙", label: "ירח" },
    ]),
    q("b-w1", "word", { label: "בקבוק" }, [
      { label: "כיסא" },
      { label: "ספר" },
      { label: "דלת" },
    ]),
    q("b-p2", "picture", { emoji: "🍌", label: "בננה" }, [
      { emoji: "🍎", label: "תפוח" },
      { emoji: "🥕", label: "גזר" },
      { emoji: "🍋", label: "לימון" },
    ]),
    q("b-w2", "word", { label: "בגד" }, [
      { label: "כובע" },
      { label: "נעל" },
      { label: "גרב" },
    ]),
    q("b-p3", "picture", { emoji: "🎈", label: "בלון" }, [
      { emoji: "⚽", label: "כדור" },
      { emoji: "☂️", label: "מטרייה" },
      { emoji: "☀️", label: "שמש" },
    ]),
    q("b-w3", "word", { label: "בועה" }, [
      { label: "מים" },
      { label: "אש" },
      { label: "רוח" },
    ]),
    q("b-p4", "picture", { emoji: "🦆", label: "ברווז" }, [
      { emoji: "🐟", label: "דג" },
      { emoji: "🐱", label: "חתול" },
      { emoji: "🐵", label: "קוף" },
    ]),
    q("b-w4", "word", { label: "בלון" }, [
      { label: "עיפרון" },
      { label: "נעל" },
      { label: "חלון" },
    ]),
    q("b-p5", "picture", { emoji: "🥚", label: "ביצה" }, [
      { emoji: "🍰", label: "עוגה" },
      { emoji: "🍦", label: "גלידה" },
      { emoji: "🍕", label: "פיצה" },
    ]),
    q("b-w5", "word", { label: "בננה" }, [
      { label: "תפוז" },
      { label: "אגס" },
      { label: "ענב" },
    ]),
  ],
  ג: [
    q("g-p1", "picture", { emoji: "🐪", label: "גמל" }, [
      { emoji: "🐴", label: "סוס" },
      { emoji: "🐘", label: "פיל" },
      { emoji: "🦁", label: "אריה" },
    ]),
    q("g-w1", "word", { label: "גן" }, [
      { label: "בית" },
      { label: "רחוב" },
      { label: "חדר" },
    ]),
    q("g-p2", "picture", { emoji: "🥕", label: "גזר" }, [
      { emoji: "🍎", label: "תפוח" },
      { emoji: "🍌", label: "בננה" },
      { emoji: "🍇", label: "ענב" },
    ]),
    q("g-w2", "word", { label: "גשם" }, [
      { label: "שמש" },
      { label: "רוח" },
      { label: "ענן" },
    ]),
    q("g-p3", "picture", { emoji: "🍦", label: "גלידה" }, [
      { emoji: "🍰", label: "עוגה" },
      { emoji: "🍕", label: "פיצה" },
      { emoji: "🥚", label: "ביצה" },
    ]),
    q("g-w3", "word", { label: "גדר" }, [
      { label: "דלת" },
      { label: "חלון" },
      { label: "קיר" },
    ]),
    q("g-p4", "picture", { emoji: "🎸", label: "גיטרה" }, [
      { emoji: "🥁", label: "תוף" },
      { emoji: "🎺", label: "חצוצרה" },
      { emoji: "🔔", label: "פעמון" },
    ]),
    q("g-w4", "word", { label: "גמד" }, [
      { label: "ענק" },
      { label: "ילד" },
      { label: "איש" },
    ]),
    q("g-p5", "picture", { emoji: "🧦", label: "גרב" }, [
      { emoji: "👟", label: "נעל" },
      { emoji: "🧢", label: "כובע" },
      { emoji: "👕", label: "חולצה" },
    ]),
    q("g-w5", "word", { label: "גיר" }, [
      { label: "עיפרון" },
      { label: "מחק" },
      { label: "ספר" },
    ]),
  ],
};

// Attach questions to alphabet entries; letters without content stay unplayable.
export const LETTERS = ALPHABET.map(function (entry) {
  return {
    ...entry,
    questions: QUESTIONS[entry.letter] || null,
  };
});

export function getLetterQuestions(letter) {
  return QUESTIONS[letter] || null;
}
