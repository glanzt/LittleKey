function createInitialSoundLevel(params) {
  const { id, name, targetLetter, targetSound, items, correctFeedback, incorrectFeedback } = params;

  return {
    id,
    gameType: 'initialSound',
    name,
    instruction: `סמנו את כל מה שמתחיל בצליל ${targetLetter}`,
    voiceover: `סמנו את כל הציורים שמתחילים בצליל ${targetSound}. הקשיבו טוב: ${targetSound}.`,
    config: {
      type: 'initialSound',
      targetLetter,
      targetSound,
      items,
    },
    correctFeedback,
    incorrectFeedback,
  };
}

const initialSoundLevels = [
  createInitialSoundLevel({
    id: 91,
    name: 'מה מתחיל ב',
    targetLetter: 'ב',
    targetSound: 'בְּ',
    items: [
      { id: 'l91-house', emoji: '🏠', label: 'בית', startsWithTarget: true },
      { id: 'l91-banana', emoji: '🍌', label: 'בננה', startsWithTarget: true },
      { id: 'l91-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
      { id: 'l91-apple', emoji: '🍎', label: 'תפוח', startsWithTarget: false },
    ],
    correctFeedback: 'יופי! בית ובננה מתחילים בְּ.',
    incorrectFeedback: 'נמשיך לחפש יחד מה מתחיל בְּ.',
  }),
  createInitialSoundLevel({
    id: 92,
    name: 'מה מתחיל מ',
    targetLetter: 'מ',
    targetSound: 'מְ',
    items: [
      { id: 'l92-umbrella', emoji: '☂️', label: 'מטרייה', startsWithTarget: true },
      { id: 'l92-plane', emoji: '✈️', label: 'מטוס', startsWithTarget: true },
      { id: 'l92-fish', emoji: '🐟', label: 'דג', startsWithTarget: false },
      { id: 'l92-book', emoji: '📘', label: 'ספר', startsWithTarget: false },
    ],
    correctFeedback: 'כל הכבוד! מטרייה ומטוס מתחילים מְ.',
    incorrectFeedback: 'נקשיב שוב ונמצא מה מתחיל מְ.',
  }),
  createInitialSoundLevel({
    id: 93,
    name: 'מה מתחיל ל',
    targetLetter: 'ל',
    targetSound: 'לְ',
    items: [
      { id: 'l93-heart', emoji: '❤️', label: 'לב', startsWithTarget: true },
      { id: 'l93-lemon', emoji: '🍋', label: 'לימון', startsWithTarget: true },
      { id: 'l93-shoe', emoji: '👟', label: 'נעל', startsWithTarget: false },
      { id: 'l93-teddy', emoji: '🧸', label: 'דובי', startsWithTarget: false },
    ],
    correctFeedback: 'נהדר! לב ולימון מתחילים לְ.',
    incorrectFeedback: 'עוד רגע תמצאו מה מתחיל לְ.',
  }),
  createInitialSoundLevel({
    id: 94,
    name: 'מה מתחיל פ',
    targetLetter: 'פ',
    targetSound: 'פְּ',
    items: [
      { id: 'l94-elephant', emoji: '🐘', label: 'פיל', startsWithTarget: true },
      { id: 'l94-flower', emoji: '🌸', label: 'פרח', startsWithTarget: true },
      { id: 'l94-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
      { id: 'l94-sun', emoji: '☀️', label: 'שמש', startsWithTarget: false },
      { id: 'l94-fish', emoji: '🐟', label: 'דג', startsWithTarget: false },
    ],
    correctFeedback: 'יפה מאוד! פיל ופרח מתחילים פְּ.',
    incorrectFeedback: 'נמשיך לחפש מה מתחיל פְּ.',
  }),
  createInitialSoundLevel({
    id: 95,
    name: 'מה מתחיל ש',
    targetLetter: 'ש',
    targetSound: 'שְׁ',
    items: [
      { id: 'l95-sun', emoji: '☀️', label: 'שמש', startsWithTarget: true },
      { id: 'l95-tooth', emoji: '🦷', label: 'שן', startsWithTarget: true },
      { id: 'l95-book', emoji: '📘', label: 'ספר', startsWithTarget: false },
      { id: 'l95-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
      { id: 'l95-fish', emoji: '🐟', label: 'דג', startsWithTarget: false },
    ],
    correctFeedback: 'מצוין! שמש ושן מתחילים שְׁ.',
    incorrectFeedback: 'חפשו שוב מה מתחיל שְׁ.',
  }),
  createInitialSoundLevel({
    id: 96,
    name: 'מה מתחיל ד',
    targetLetter: 'ד',
    targetSound: 'דְ',
    items: [
      { id: 'l96-fish', emoji: '🐟', label: 'דג', startsWithTarget: true },
      { id: 'l96-teddy', emoji: '🧸', label: 'דובי', startsWithTarget: true },
      { id: 'l96-hat', emoji: '🧢', label: 'כובע', startsWithTarget: false },
      { id: 'l96-apple', emoji: '🍎', label: 'תפוח', startsWithTarget: false },
      { id: 'l96-book', emoji: '📘', label: 'ספר', startsWithTarget: false },
    ],
    correctFeedback: 'יופי! דג ודובי מתחילים דְ.',
    incorrectFeedback: 'בואו נמצא יחד מה מתחיל דְ.',
  }),
  createInitialSoundLevel({
    id: 97,
    name: 'מה מתחיל נ',
    targetLetter: 'נ',
    targetSound: 'נְ',
    items: [
      { id: 'l97-shoe', emoji: '👟', label: 'נעל', startsWithTarget: true },
      { id: 'l97-candle', emoji: '🕯️', label: 'נר', startsWithTarget: true },
      { id: 'l97-snake', emoji: '🐍', label: 'נחש', startsWithTarget: true },
      { id: 'l97-house', emoji: '🏠', label: 'בית', startsWithTarget: false },
      { id: 'l97-balloon', emoji: '🎈', label: 'בלון', startsWithTarget: false },
    ],
    correctFeedback: 'כל הכבוד! נעל, נר ונחש מתחילים נְ.',
    incorrectFeedback: 'כמעט. יש עוד תמונות שמתחילות נְ.',
  }),
  createInitialSoundLevel({
    id: 98,
    name: 'מה מתחיל ת',
    targetLetter: 'ת',
    targetSound: 'תְּ',
    items: [
      { id: 'l98-apple', emoji: '🍎', label: 'תפוח', startsWithTarget: true },
      { id: 'l98-drum', emoji: '🥁', label: 'תוף', startsWithTarget: true },
      { id: 'l98-rooster', emoji: '🐓', label: 'תרנגול', startsWithTarget: true },
      { id: 'l98-phone', emoji: '📞', label: 'טלפון', startsWithTarget: false },
      { id: 'l98-horse', emoji: '🐴', label: 'סוס', startsWithTarget: false },
    ],
    correctFeedback: 'מעולה! תפוח, תוף ותרנגול מתחילים תְּ.',
    incorrectFeedback: 'נקשיב שוב לצליל תְּ ונמשיך לחפש.',
  }),
  createInitialSoundLevel({
    id: 99,
    name: 'מה מתחיל ס',
    targetLetter: 'ס',
    targetSound: 'סְ',
    items: [
      { id: 'l99-horse', emoji: '🐴', label: 'סוס', startsWithTarget: true },
      { id: 'l99-book', emoji: '📘', label: 'ספר', startsWithTarget: true },
      { id: 'l99-boat', emoji: '🚤', label: 'סירה', startsWithTarget: true },
      { id: 'l99-sun', emoji: '☀️', label: 'שמש', startsWithTarget: false },
      { id: 'l99-turtle', emoji: '🐢', label: 'צב', startsWithTarget: false },
      { id: 'l99-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
    ],
    correctFeedback: 'אלופים! סוס, ספר וסירה מתחילים סְ.',
    incorrectFeedback: 'חפשו את מה שבאמת מתחיל סְ.',
  }),
  createInitialSoundLevel({
    id: 100,
    name: 'מה מתחיל ק',
    targetLetter: 'ק',
    targetSound: 'קְ',
    items: [
      { id: 'l100-dice', emoji: '🎲', label: 'קובייה', startsWithTarget: true },
      { id: 'l100-rainbow', emoji: '🌈', label: 'קשת', startsWithTarget: true },
      { id: 'l100-train', emoji: '🚂', label: 'קטר', startsWithTarget: true },
      { id: 'l100-hat', emoji: '🧢', label: 'כובע', startsWithTarget: false },
      { id: 'l100-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
      { id: 'l100-apple', emoji: '🍎', label: 'תפוח', startsWithTarget: false },
    ],
    correctFeedback: 'מצוין! קובייה, קשת וקטר מתחילים קְ.',
    incorrectFeedback: 'נמשיך לחפש מה מתחיל קְ.',
  }),
  createInitialSoundLevel({
    id: 101,
    name: 'מה מתחיל ג',
    targetLetter: 'ג',
    targetSound: 'גְ',
    items: [
      { id: 'l101-carrot', emoji: '🥕', label: 'גזר', startsWithTarget: true },
      { id: 'l101-icecream', emoji: '🍦', label: 'גלידה', startsWithTarget: true },
      { id: 'l101-fish', emoji: '🐟', label: 'דג', startsWithTarget: false },
      { id: 'l101-shoe', emoji: '👟', label: 'נעל', startsWithTarget: false },
      { id: 'l101-book', emoji: '📘', label: 'ספר', startsWithTarget: false },
    ],
    correctFeedback: 'יופי! גזר וגלידה מתחילים גְ.',
    incorrectFeedback: 'עוד חפץ או שניים מתחילים גְ.',
  }),
  createInitialSoundLevel({
    id: 102,
    name: 'מה מתחיל כ',
    targetLetter: 'כ',
    targetSound: 'כְּ',
    items: [
      { id: 'l102-hat', emoji: '🧢', label: 'כובע', startsWithTarget: true },
      { id: 'l102-ball', emoji: '⚽', label: 'כדור', startsWithTarget: true },
      { id: 'l102-spoon', emoji: '🥄', label: 'כפית', startsWithTarget: true },
      { id: 'l102-rainbow', emoji: '🌈', label: 'קשת', startsWithTarget: false },
      { id: 'l102-carrot', emoji: '🥕', label: 'גזר', startsWithTarget: false },
    ],
    correctFeedback: 'נהדר! כובע, כדור וכפית מתחילים כְּ.',
    incorrectFeedback: 'בואו נקשיב שוב לצליל כְּ.',
  }),
  createInitialSoundLevel({
    id: 103,
    name: 'מה מתחיל ט',
    targetLetter: 'ט',
    targetSound: 'טְ',
    items: [
      { id: 'l103-phone', emoji: '📞', label: 'טלפון', startsWithTarget: true },
      { id: 'l103-lamb', emoji: '🐑', label: 'טלה', startsWithTarget: true },
      { id: 'l103-drum', emoji: '🥁', label: 'תוף', startsWithTarget: false },
      { id: 'l103-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
      { id: 'l103-banana', emoji: '🍌', label: 'בננה', startsWithTarget: false },
    ],
    correctFeedback: 'כל הכבוד! טלפון וטלה מתחילים טְ.',
    incorrectFeedback: 'נמשיך לחפש מה מתחיל טְ.',
  }),
  createInitialSoundLevel({
    id: 104,
    name: 'מה מתחיל צ',
    targetLetter: 'צ',
    targetSound: 'צְ',
    items: [
      { id: 'l104-bird', emoji: '🐦', label: 'ציפור', startsWithTarget: true },
      { id: 'l104-turtle', emoji: '🐢', label: 'צב', startsWithTarget: true },
      { id: 'l104-plate', emoji: '🍽️', label: 'צלחת', startsWithTarget: true },
      { id: 'l104-book', emoji: '📘', label: 'ספר', startsWithTarget: false },
      { id: 'l104-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
    ],
    correctFeedback: 'יפה מאוד! ציפור, צב וצלחת מתחילים צְ.',
    incorrectFeedback: 'יש עוד תמונות שמתחילות צְ.',
  }),
  createInitialSoundLevel({
    id: 105,
    name: 'מה מתחיל ח',
    targetLetter: 'ח',
    targetSound: 'חְ',
    items: [
      { id: 'l105-window', emoji: '🪟', label: 'חלון', startsWithTarget: true },
      { id: 'l105-cat', emoji: '🐈', label: 'חתול', startsWithTarget: true },
      { id: 'l105-apple', emoji: '🍎', label: 'תפוח', startsWithTarget: false },
      { id: 'l105-hat', emoji: '🧢', label: 'כובע', startsWithTarget: false },
      { id: 'l105-sun', emoji: '☀️', label: 'שמש', startsWithTarget: false },
    ],
    correctFeedback: 'מצוין! חלון וחתול מתחילים חְ.',
    incorrectFeedback: 'בואו נחפש מה מתחיל חְ.',
  }),
  createInitialSoundLevel({
    id: 106,
    name: 'מה מתחיל א',
    targetLetter: 'א',
    targetSound: 'אַ',
    items: [
      { id: 'l106-lion', emoji: '🦁', label: 'אריה', startsWithTarget: true },
      { id: 'l106-rabbit', emoji: '🐇', label: 'ארנב', startsWithTarget: true },
      { id: 'l106-chick', emoji: '🐥', label: 'אפרוח', startsWithTarget: true },
      { id: 'l106-teddy', emoji: '🧸', label: 'דובי', startsWithTarget: false },
      { id: 'l106-banana', emoji: '🍌', label: 'בננה', startsWithTarget: false },
    ],
    correctFeedback: 'איזה יופי! אריה, ארנב ואפרוח מתחילים אַ.',
    incorrectFeedback: 'נמשיך לחפש מה מתחיל אַ.',
  }),
  createInitialSoundLevel({
    id: 107,
    name: 'מה מתחיל ב קשה',
    targetLetter: 'ב',
    targetSound: 'בְּ',
    items: [
      { id: 'l107-house', emoji: '🏠', label: 'בית', startsWithTarget: true },
      { id: 'l107-balloon', emoji: '🎈', label: 'בלון', startsWithTarget: true },
      { id: 'l107-banana', emoji: '🍌', label: 'בננה', startsWithTarget: true },
      { id: 'l107-elephant', emoji: '🐘', label: 'פיל', startsWithTarget: false },
      { id: 'l107-lemon', emoji: '🍋', label: 'לימון', startsWithTarget: false },
      { id: 'l107-book', emoji: '📘', label: 'ספר', startsWithTarget: false },
    ],
    correctFeedback: 'מקסים! בית, בלון ובננה מתחילים בְּ.',
    incorrectFeedback: 'חפשו בזהירות מה מתחיל בְּ.',
  }),
  createInitialSoundLevel({
    id: 108,
    name: 'מה מתחיל מ קשה',
    targetLetter: 'מ',
    targetSound: 'מְ',
    items: [
      { id: 'l108-umbrella', emoji: '☂️', label: 'מטרייה', startsWithTarget: true },
      { id: 'l108-key', emoji: '🔑', label: 'מפתח', startsWithTarget: true },
      { id: 'l108-car', emoji: '🚗', label: 'מכונית', startsWithTarget: true },
      { id: 'l108-candle', emoji: '🕯️', label: 'נר', startsWithTarget: false },
      { id: 'l108-drum', emoji: '🥁', label: 'תוף', startsWithTarget: false },
      { id: 'l108-ball', emoji: '⚽', label: 'כדור', startsWithTarget: false },
    ],
    correctFeedback: 'כל הכבוד! מטרייה, מפתח ומכונית מתחילים מְ.',
    incorrectFeedback: 'נמשיך לחפש מה מתחיל מְ.',
  }),
  createInitialSoundLevel({
    id: 109,
    name: 'מה מתחיל ש קשה',
    targetLetter: 'ש',
    targetSound: 'שְׁ',
    items: [
      { id: 'l109-sun', emoji: '☀️', label: 'שמש', startsWithTarget: true },
      { id: 'l109-tooth', emoji: '🦷', label: 'שן', startsWithTarget: true },
      { id: 'l109-clock', emoji: '⏰', label: 'שעון', startsWithTarget: true },
      { id: 'l109-book', emoji: '📘', label: 'ספר', startsWithTarget: false },
      { id: 'l109-horse', emoji: '🐴', label: 'סוס', startsWithTarget: false },
      { id: 'l109-hat', emoji: '🧢', label: 'כובע', startsWithTarget: false },
    ],
    correctFeedback: 'מעולה! שמש, שן ושעון מתחילים שְׁ.',
    incorrectFeedback: 'עוד רגע תמצאו את כל מה שמתחיל שְׁ.',
  }),
  createInitialSoundLevel({
    id: 110,
    name: 'מה מתחיל ל קשה',
    targetLetter: 'ל',
    targetSound: 'לְ',
    items: [
      { id: 'l110-heart', emoji: '❤️', label: 'לב', startsWithTarget: true },
      { id: 'l110-bread', emoji: '🍞', label: 'לחם', startsWithTarget: true },
      { id: 'l110-lemon', emoji: '🍋', label: 'לימון', startsWithTarget: true },
      { id: 'l110-shoe', emoji: '👟', label: 'נעל', startsWithTarget: false },
      { id: 'l110-train', emoji: '🚂', label: 'רכבת', startsWithTarget: false },
      { id: 'l110-apple', emoji: '🍎', label: 'תפוח', startsWithTarget: false },
    ],
    correctFeedback: 'נהדר! לב, לחם ולימון מתחילים לְ.',
    incorrectFeedback: 'נקשיב שוב ונמצא מה מתחיל לְ.',
  }),
];

function makeObjects(levelId, groupKey, emoji, label, count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `l${levelId}-${groupKey}-${index + 1}`,
    emoji,
    label,
  }));
}

function makeGroup(levelId, groupKey, emoji, label, count) {
  return {
    id: `l${levelId}-${groupKey}`,
    items: makeObjects(levelId, groupKey, emoji, label, count),
  };
}

function createQuantityMatchLevel(params) {
  const {
    id,
    name,
    instruction,
    voiceover,
    correctCount,
    options,
    groups,
    correctGroupId,
    interaction,
    correctFeedback,
    incorrectFeedback,
  } = params;

  return {
    id,
    gameType: 'counting',
    name,
    instruction,
    voiceover,
    config: {
      type: 'counting',
      subType: 'quantityMatch',
      correctCount,
      options,
      groups,
      correctGroupId,
      interaction,
    },
    correctFeedback,
    incorrectFeedback,
  };
}

const quantityMatchLevels = [
  createQuantityMatchLevel({
    id: 111,
    name: 'שני בלונים',
    instruction: 'הקש על 2',
    voiceover: 'איפה 2?',
    correctCount: 2,
    options: [1, 2, 3],
    groups: [makeGroup(111, 'balloons', '🎈', 'בלון', 2)],
    correctGroupId: 'l111-balloons',
    interaction: 'tapNumber',
    correctFeedback: 'כל הכבוד! זה 2!',
    incorrectFeedback: 'כמעט, נסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 112,
    name: 'שלושה תפוחים',
    instruction: 'הקש על 3',
    voiceover: 'מצא את 3',
    correctCount: 3,
    options: [2, 3, 4],
    groups: [makeGroup(112, 'apples', '🍎', 'תפוח', 3)],
    correctGroupId: 'l112-apples',
    interaction: 'tapNumber',
    correctFeedback: 'יופי! זה 3!',
    incorrectFeedback: 'בוא ננסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 113,
    name: 'ארבע מכוניות',
    instruction: 'הקש על 4',
    voiceover: 'איפה 4?',
    correctCount: 4,
    options: [3, 4, 5],
    groups: [makeGroup(113, 'cars', '🚗', 'מכונית', 4)],
    correctGroupId: 'l113-cars',
    interaction: 'tapNumber',
    correctFeedback: 'מצוין! זה 4!',
    incorrectFeedback: 'עוד פעם, אתה מצליח.',
  }),
  createQuantityMatchLevel({
    id: 114,
    name: 'חמישה כוכבים',
    instruction: 'הקש על 5',
    voiceover: 'מצא את 5',
    correctCount: 5,
    options: [4, 5, 6],
    groups: [makeGroup(114, 'stars', '⭐', 'כוכב', 5)],
    correctGroupId: 'l114-stars',
    interaction: 'tapNumber',
    correctFeedback: 'כל הכבוד! זה 5!',
    incorrectFeedback: 'כמעט, נסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 115,
    name: 'גרור את 3 לכדורים',
    instruction: 'גרור את 3 לכדורים',
    voiceover: 'גרור 3 לכדורים',
    correctCount: 3,
    options: [2, 3, 4],
    groups: [makeGroup(115, 'balls', '⚽', 'כדור', 3)],
    correctGroupId: 'l115-balls',
    interaction: 'dragNumberToGroup',
    correctFeedback: 'יופי! חיברת נכון!',
    incorrectFeedback: 'נסה שוב, אתה בדרך הנכונה.',
  }),
  createQuantityMatchLevel({
    id: 116,
    name: 'הצעצועים אל 4',
    instruction: 'גרור ל-4',
    voiceover: 'גרור ל-4',
    correctCount: 4,
    options: [3, 4, 5],
    groups: [makeGroup(116, 'toys', '🧸', 'צעצוע', 4)],
    correctGroupId: 'l116-toys',
    interaction: 'dragGroupToNumber',
    correctFeedback: 'מצוין! זה 4!',
    incorrectFeedback: 'עוד פעם, זה יצליח.',
  }),
  createQuantityMatchLevel({
    id: 117,
    name: 'חמישה חתולים',
    instruction: 'גרור את 5 לחתולים',
    voiceover: 'גרור 5 לחתולים',
    correctCount: 5,
    options: [4, 5, 6],
    groups: [makeGroup(117, 'cats', '🐱', 'חתול', 5)],
    correctGroupId: 'l117-cats',
    interaction: 'dragNumberToGroup',
    correctFeedback: 'כל הכבוד! חיברת נכון!',
    incorrectFeedback: 'כמעט, בוא ננסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 118,
    name: 'הבננות אל 6',
    instruction: 'גרור ל-6',
    voiceover: 'גרור ל-6',
    correctCount: 6,
    options: [5, 6, 7],
    groups: [makeGroup(118, 'bananas', '🍌', 'בננה', 6)],
    correctGroupId: 'l118-bananas',
    interaction: 'dragGroupToNumber',
    correctFeedback: 'יופי! זה 6!',
    incorrectFeedback: 'נסה שוב, אתה קרוב.',
  }),
  createQuantityMatchLevel({
    id: 119,
    name: 'בלונים ומכוניות',
    instruction: 'גע בבלונים ואז ב-5',
    voiceover: 'בלונים, ואז 5',
    correctCount: 5,
    options: [3, 4, 5, 6],
    groups: [
      makeGroup(119, 'balloons', '🎈', 'בלון', 5),
      makeGroup(119, 'cars', '🚗', 'מכונית', 3),
    ],
    correctGroupId: 'l119-balloons',
    interaction: 'tapGroupThenNumber',
    correctFeedback: 'מצוין! 5 בלונים!',
    incorrectFeedback: 'כמעט, נסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 120,
    name: 'כדורים וכוכבים',
    instruction: 'גע בכדורים ואז ב-6',
    voiceover: 'כדורים, ואז 6',
    correctCount: 6,
    options: [4, 5, 6],
    groups: [
      makeGroup(120, 'balls', '⚽', 'כדור', 6),
      makeGroup(120, 'stars', '⭐', 'כוכב', 4),
    ],
    correctGroupId: 'l120-balls',
    interaction: 'tapGroupThenNumber',
    correctFeedback: 'כל הכבוד! זה 6!',
    incorrectFeedback: 'בוא ננסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 121,
    name: 'החתולים והשבע',
    instruction: 'גע בחתולים ואז ב-7',
    voiceover: 'חתולים, ואז 7',
    correctCount: 7,
    options: [2, 6, 7],
    groups: [
      makeGroup(121, 'cats', '🐱', 'חתול', 7),
      makeGroup(121, 'apples', '🍎', 'תפוח', 2),
    ],
    correctGroupId: 'l121-cats',
    interaction: 'tapGroupThenNumber',
    correctFeedback: 'יופי! זה 7!',
    incorrectFeedback: 'עוד פעם, אתה מצליח.',
  }),
  createQuantityMatchLevel({
    id: 122,
    name: 'הצעצועים והשמונה',
    instruction: 'גע בצעצועים ואז ב-8',
    voiceover: 'צעצועים, ואז 8',
    correctCount: 8,
    options: [5, 7, 8],
    groups: [
      makeGroup(122, 'toys', '🧸', 'צעצוע', 8),
      makeGroup(122, 'cars', '🚗', 'מכונית', 5),
    ],
    correctGroupId: 'l122-toys',
    interaction: 'tapGroupThenNumber',
    correctFeedback: 'מצוין! זה 8!',
    incorrectFeedback: 'נסה שוב, אתה קרוב.',
  }),
  createQuantityMatchLevel({
    id: 123,
    name: 'שלוש קבוצות וכוכבים',
    instruction: 'גע בכוכבים ואז ב-6',
    voiceover: 'כוכבים, ואז 6',
    correctCount: 6,
    options: [3, 4, 5, 6],
    groups: [
      makeGroup(123, 'balloons', '🎈', 'בלון', 3),
      makeGroup(123, 'stars', '⭐', 'כוכב', 6),
      makeGroup(123, 'apples', '🍎', 'תפוח', 4),
    ],
    correctGroupId: 'l123-stars',
    interaction: 'tapGroupThenNumber',
    correctFeedback: 'כל הכבוד! 6 כוכבים!',
    incorrectFeedback: 'כמעט, נסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 124,
    name: 'גרור את 7 לכדורים',
    instruction: 'גרור את 7 לכדורים',
    voiceover: 'גרור 7 לכדורים',
    correctCount: 7,
    options: [4, 5, 6, 7],
    groups: [
      makeGroup(124, 'cats', '🐱', 'חתול', 5),
      makeGroup(124, 'balls', '⚽', 'כדור', 7),
      makeGroup(124, 'cars', '🚗', 'מכונית', 4),
    ],
    correctGroupId: 'l124-balls',
    interaction: 'dragNumberToGroup',
    correctFeedback: 'יופי! זה 7!',
    incorrectFeedback: 'בוא ננסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 125,
    name: 'הבננות והשמונה',
    instruction: 'הקש על 8',
    voiceover: 'איפה 8?',
    correctCount: 8,
    options: [5, 6, 7, 8],
    groups: [
      makeGroup(125, 'bananas', '🍌', 'בננה', 8),
      makeGroup(125, 'stars', '⭐', 'כוכב', 6),
      makeGroup(125, 'toys', '🧸', 'צעצוע', 5),
    ],
    correctGroupId: 'l125-bananas',
    interaction: 'tapNumber',
    correctFeedback: 'מצוין! זה 8!',
    incorrectFeedback: 'עוד פעם, אתה מצליח.',
  }),
  createQuantityMatchLevel({
    id: 126,
    name: 'הבלונים והתשע',
    instruction: 'גרור ל-9',
    voiceover: 'גרור ל-9',
    correctCount: 9,
    options: [4, 7, 8, 9],
    groups: [
      makeGroup(126, 'balloons', '🎈', 'בלון', 9),
      makeGroup(126, 'apples', '🍎', 'תפוח', 7),
      makeGroup(126, 'cats', '🐱', 'חתול', 4),
    ],
    correctGroupId: 'l126-balloons',
    interaction: 'dragGroupToNumber',
    correctFeedback: 'כל הכבוד! זה 9!',
    incorrectFeedback: 'נסה שוב, אתה קרוב.',
  }),
  createQuantityMatchLevel({
    id: 127,
    name: 'שמונה מכוניות',
    instruction: 'הקש על 8',
    voiceover: 'מצא את 8',
    correctCount: 8,
    options: [6, 7, 8, 9],
    groups: [makeGroup(127, 'cars', '🚗', 'מכונית', 8)],
    correctGroupId: 'l127-cars',
    interaction: 'tapNumber',
    correctFeedback: 'יופי! זה 8!',
    incorrectFeedback: 'כמעט, נסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 128,
    name: 'תשעה כוכבים',
    instruction: 'גרור את 9 לכוכבים',
    voiceover: 'גרור 9 לכוכבים',
    correctCount: 9,
    options: [5, 6, 7, 8, 9],
    groups: [makeGroup(128, 'stars', '⭐', 'כוכב', 9)],
    correctGroupId: 'l128-stars',
    interaction: 'dragNumberToGroup',
    correctFeedback: 'מצוין! 9 כוכבים!',
    incorrectFeedback: 'בוא ננסה שוב.',
  }),
  createQuantityMatchLevel({
    id: 129,
    name: 'בלונים או כדורים',
    instruction: 'גע בבלונים ואז ב-9',
    voiceover: 'בלונים, ואז 9',
    correctCount: 9,
    options: [7, 8, 9],
    groups: [
      makeGroup(129, 'balloons', '🎈', 'בלון', 9),
      makeGroup(129, 'balls', '⚽', 'כדור', 8),
    ],
    correctGroupId: 'l129-balloons',
    interaction: 'tapGroupThenNumber',
    correctFeedback: 'כל הכבוד! זה 9!',
    incorrectFeedback: 'נסה שוב, אתה בדרך הנכונה.',
  }),
  createQuantityMatchLevel({
    id: 130,
    name: 'הכוכבים הגדולים',
    instruction: 'גע בכוכבים ואז ב-9',
    voiceover: 'כוכבים, ואז 9',
    correctCount: 9,
    options: [6, 8, 9],
    groups: [
      makeGroup(130, 'bananas', '🍌', 'בננה', 6),
      makeGroup(130, 'cars', '🚗', 'מכונית', 8),
      makeGroup(130, 'stars', '⭐', 'כוכב', 9),
    ],
    correctGroupId: 'l130-stars',
    interaction: 'tapGroupThenNumber',
    correctFeedback: 'יופי! סיימת נהדר!',
    incorrectFeedback: 'כמעט, בוא ננסה שוב.',
  }),
];

export const levels = [
  // --- Level 1: Sorting - pencil to bin ---
  {
    id: 1, gameType: 'sorting', name: 'שים את העיפרון במגירה',
    instruction: 'עיפרון — לצלחת או למגירה?',
    voiceover: 'עיפרון — אוכלים? שים אותו במקום הנכון!',
    config: {
      type: 'sorting', subType: 'dragSort', singleObject: true,
      objects: [{ id: 'pencil', emoji: '✏️', label: 'עיפרון', edible: false }],
    },
    correctFeedback: 'נכון! עיפרון לא אוכלים!',
    incorrectFeedback: 'עיפרון? לא אוכלים! למגירה!',
  },
  // --- Level 2: Sorting - ball edible? ---
  {
    id: 2, gameType: 'sorting', name: 'כדור — אוכלים?',
    instruction: 'אפשר לאכול כדור?',
    voiceover: 'כדור — אוכלים אותו? כן או לא?',
    config: {
      type: 'sorting', subType: 'yesNo', singleObject: true,
      objects: [{ id: 'ball', emoji: '⚽', label: 'כדור', edible: false }],
    },
    correctFeedback: 'נכון! כדור זה לשחק, לא לאכול!',
    incorrectFeedback: 'כדור? לא! כדור לא אוכלים — משחקים בו!',
  },
  // --- Level 3: Shapes - drag 4 shapes ---
  {
    id: 3, gameType: 'shapes', name: 'שים 4 צורות במקום',
    instruction: 'גרור כל צורה למקום הנכון',
    voiceover: 'ארבע צורות מחכות! שים כל אחת במקום שלה!',
    config: {
      type: 'shapes', subType: 'dragShape', shapes: [], correctId: '',
      outlines: [
        { id: 'o-circle', emoji: '⭕', label: 'עיגול' },
        { id: 'o-square', emoji: '⬜', label: 'ריבוע' },
        { id: 'o-triangle', emoji: '△', label: 'משולש' },
        { id: 'o-star', emoji: '☆', label: 'כוכב' },
      ],
      draggables: [
        { id: 'd-circle', emoji: '🔴', label: 'עיגול', shape: 'circle' },
        { id: 'd-square', emoji: '🟦', label: 'ריבוע', shape: 'square' },
        { id: 'd-triangle', emoji: '🔺', label: 'משולש', shape: 'triangle' },
        { id: 'd-star', emoji: '⭐', label: 'כוכב', shape: 'star' },
      ],
    },
    correctFeedback: 'מדהים! כל הצורות במקום!',
    incorrectFeedback: 'הצורה הזו לא מתאימה פה — נסה מקום אחר!',
  },
  // --- Level 4: Shapes - find square ---
  {
    id: 4, gameType: 'shapes', name: 'מצא את הריבוע',
    instruction: 'לחץ על הריבוע',
    voiceover: 'איפה הריבוע? לחץ עליו!',
    config: {
      type: 'shapes', subType: 'findShape', correctId: 'square',
      targetShapeName: 'ריבוע',
      shapes: [
        { id: 'square', emoji: '🟥', label: 'ריבוע', shape: 'square' },
        { id: 'circle', emoji: '🟡', label: 'עיגול', shape: 'circle' },
        { id: 'triangle', emoji: '🔺', label: 'משולש', shape: 'triangle' },
      ],
    },
    correctFeedback: 'נכון! ריבוע! יש לו ארבע פינות!',
    incorrectFeedback: 'הריבוע הוא הצורה עם ארבע פינות שוות!',
  },
  // --- Level 5: Counting - how many fish ---
  {
    id: 5, gameType: 'counting', name: 'כמה דגים?',
    instruction: 'כמה דגים שוחים?',
    voiceover: 'כמה דגים שוחים במים? ספור ולחץ!',
    config: {
      type: 'counting', subType: 'howMany', correctCount: 5, options: [4, 5, 6],
      objects: [
        { id: 'f1', emoji: '🐟', label: 'דג' }, { id: 'f2', emoji: '🐟', label: 'דג' },
        { id: 'f3', emoji: '🐟', label: 'דג' }, { id: 'f4', emoji: '🐟', label: 'דג' },
        { id: 'f5', emoji: '🐟', label: 'דג' },
      ],
    },
    correctFeedback: 'מדהים! 5 דגים!',
    incorrectFeedback: 'בוא נספור את הדגים ביחד!',
  },
  // --- Level 6: OddOneOut - not clothing ---
  {
    id: 6, gameType: 'oddOneOut', name: 'מי לא בגד?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'ארבעה דברים! אחד לא שייך! מי זה?',
    config: {
      type: 'oddOneOut', oddId: 'cup',
      objects: [
        { id: 'shirt', emoji: '👕', label: 'חולצה' },
        { id: 'pants', emoji: '👖', label: 'מכנסיים' },
        { id: 'hat', emoji: '🧢', label: 'כובע' },
        { id: 'cup', emoji: '☕', label: 'ספל' },
      ],
    },
    correctFeedback: 'נכון! ספל לא לובשים — שותים ממנו!',
    incorrectFeedback: 'חולצה, מכנסיים וכובע — כולם בגדים! מי לא?',
  },
  // --- Level 7: Sorting - bread or key ---
  {
    id: 7, gameType: 'sorting', name: 'לחם או מפתח?',
    instruction: 'שים כל דבר במקום הנכון',
    voiceover: 'שני דברים — שים כל אחד במקום הנכון! אוכל בצלחת, לא אוכל במגירה!',
    config: {
      type: 'sorting', subType: 'dragSort', singleObject: false,
      objects: [
        { id: 'bread', emoji: '🍞', label: 'לחם', edible: true },
        { id: 'key', emoji: '🔑', label: 'מפתח', edible: false },
      ],
    },
    correctFeedback: 'סיימת! לחם אוכלים, מפתח לא!',
    incorrectFeedback: 'נסה שוב! חשוב — מה אוכלים?',
  },
  // --- Level 8: Counting - where is 5 ---
  {
    id: 8, gameType: 'counting', name: 'איפה יש 5?',
    instruction: 'איפה יש 5 אבנים?',
    voiceover: 'איפה יש חמש אבנים צבעוניות? לחץ על הקבוצה!',
    config: {
      type: 'counting', subType: 'whichGroup', correctCount: 5, options: [],
      objects: [],
      groups: {
        right: [
          { id: 'r1', emoji: '🪨', label: 'אבן' }, { id: 'r2', emoji: '🪨', label: 'אבן' },
          { id: 'r3', emoji: '🪨', label: 'אבן' }, { id: 'r4', emoji: '🪨', label: 'אבן' },
          { id: 'r5', emoji: '🪨', label: 'אבן' },
        ],
        left: [
          { id: 'l1', emoji: '🪨', label: 'אבן' }, { id: 'l2', emoji: '🪨', label: 'אבן' },
          { id: 'l3', emoji: '🪨', label: 'אבן' }, { id: 'l4', emoji: '🪨', label: 'אבן' },
        ],
      },
    },
    correctFeedback: 'מעולה! 5 אבנים!',
    incorrectFeedback: 'ספור לאט — כאן ארבע, וכאן חמש!',
  },
  // --- Level 9: Sorting - big sort 5 items ---
  {
    id: 9, gameType: 'sorting', name: 'מיון גדול — 5 דברים',
    instruction: 'שים כל דבר במקום הנכון',
    voiceover: 'הפעם חמישה דברים! שים כל אחד בצלחת אם אוכלים, או במגירה אם לא!',
    config: {
      type: 'sorting', subType: 'dragSort', singleObject: false,
      objects: [
        { id: 'strawberry', emoji: '🍓', label: 'תות', edible: true },
        { id: 'sock', emoji: '🧦', label: 'גרב', edible: false },
        { id: 'bun', emoji: '🥐', label: 'לחמנייה', edible: true },
        { id: 'toy', emoji: '🧸', label: 'צעצוע', edible: false },
        { id: 'watermelon', emoji: '🍉', label: 'אבטיח', edible: true },
      ],
    },
    correctFeedback: 'אלוף המיון! כל דבר במקום הנכון!',
    incorrectFeedback: 'נסה שוב! חשוב — אוכלים את זה?',
  },
  // --- Level 10: Shapes - roof shape ---
  {
    id: 10, gameType: 'shapes', name: 'מה הצורה של הגג?',
    instruction: 'מה הצורה של גג הבית?',
    voiceover: 'תסתכל על הגג — מה הצורה שלו?',
    config: {
      type: 'shapes', subType: 'whatShape', correctId: 'triangle',
      shapes: [{ id: 'house', emoji: '🏠', label: 'בית', shape: 'house' }],
      shapeOptions: [
        { id: 'circle', emoji: '⭕', label: 'עיגול' },
        { id: 'square', emoji: '⬜', label: 'ריבוע' },
        { id: 'triangle', emoji: '🔺', label: 'משולש' },
      ],
    },
    correctFeedback: 'יפה! הגג בצורת משולש!',
    incorrectFeedback: 'הגג הוא עם שלוש פינות — משולש!',
  },
  // --- Level 11: Silhouette - car ---
  {
    id: 11, gameType: 'silhouette', name: 'צל של מכונית',
    instruction: 'מי מתחבא בצל?',
    voiceover: 'מה מתחבא בצל? לחץ על התמונה הנכונה!',
    config: {
      type: 'silhouette', subType: 'tapMatch',
      silhouettes: [{ id: 'shadow-car', emoji: '🚗', label: 'מכונית' }],
      options: [
        { id: 'car', emoji: '🚗', label: 'מכונית' },
        { id: 'bike', emoji: '🚲', label: 'אופניים' },
      ],
      matches: { 'shadow-car': 'car' },
    },
    correctFeedback: 'ברום ברום! זו מכונית!',
    incorrectFeedback: 'תסתכל — יש לה ארבעה גלגלים!',
  },
  // --- Level 12: Sorting - shoe edible? ---
  {
    id: 12, gameType: 'sorting', name: 'נעל — אוכלים?',
    instruction: 'אפשר לאכול נעל?',
    voiceover: 'נעל — אפשר לאכול? כן או לא?',
    config: {
      type: 'sorting', subType: 'yesNo', singleObject: true,
      objects: [{ id: 'shoe', emoji: '👟', label: 'נעל', edible: false }],
    },
    correctFeedback: 'נכון! נעל לא אוכלים! היא בשביל הרגליים!',
    incorrectFeedback: 'נעל? לא! נעל לא אוכלים!',
  },
  // --- Level 13: Shapes - find triangle ---
  {
    id: 13, gameType: 'shapes', name: 'מצא את המשולש',
    instruction: 'לחץ על המשולש',
    voiceover: 'איפה המשולש? הצורה עם שלוש פינות!',
    config: {
      type: 'shapes', subType: 'findShape', correctId: 'triangle',
      targetShapeName: 'משולש',
      shapes: [
        { id: 'circle', emoji: '🔴', label: 'עיגול', shape: 'circle' },
        { id: 'square', emoji: '🟦', label: 'ריבוע', shape: 'square' },
        { id: 'triangle', emoji: '🔺', label: 'משולש', shape: 'triangle' },
      ],
    },
    correctFeedback: 'מצאת את המשולש! שלוש פינות!',
    incorrectFeedback: 'המשולש הוא עם שלוש פינות — כמו גג של בית!',
  },
  // --- Level 14: Counting - how many balloons ---
  {
    id: 14, gameType: 'counting', name: 'כמה בלונים?',
    instruction: 'כמה בלונים יש?',
    voiceover: 'כמה בלונים אתה רואה? ספור ולחץ!',
    config: {
      type: 'counting', subType: 'howMany', correctCount: 4, options: [3, 4, 5],
      objects: [
        { id: 'b1', emoji: '🎈', label: 'בלון' }, { id: 'b2', emoji: '🎈', label: 'בלון' },
        { id: 'b3', emoji: '🎈', label: 'בלון' }, { id: 'b4', emoji: '🎈', label: 'בלון' },
      ],
    },
    correctFeedback: 'יופי! 4 בלונים!',
    incorrectFeedback: 'ננסה עוד פעם! אחת, שתיים, שלוש, ארבע!',
  },
  // --- Level 15: Silhouette - 3 mixed drag ---
  {
    id: 15, gameType: 'silhouette', name: '3 צלליות — מעורבב',
    instruction: 'גרור כל תמונה לצל הנכון',
    voiceover: 'שלוש צלליות! גרור כל תמונה לצל שלה!',
    config: {
      type: 'silhouette', subType: 'dragMatch',
      silhouettes: [
        { id: 'shadow-ball', emoji: '⚽', label: 'כדור' },
        { id: 'shadow-hat', emoji: '🧢', label: 'כובע' },
        { id: 'shadow-book', emoji: '📖', label: 'ספר' },
      ],
      options: [
        { id: 'book', emoji: '📖', label: 'ספר' },
        { id: 'ball', emoji: '⚽', label: 'כדור' },
        { id: 'hat', emoji: '🧢', label: 'כובע' },
      ],
      matches: { 'shadow-ball': 'ball', 'shadow-hat': 'hat', 'shadow-book': 'book' },
    },
    correctFeedback: 'כל הצלליות נחשפו! אלוף!',
    incorrectFeedback: 'לא פה — תסתכל על הצורה!',
  },
  // --- Level 16: Silhouette - 2 vehicles drag ---
  {
    id: 16, gameType: 'silhouette', name: '2 צלליות — כלי רכב',
    instruction: 'גרור כל רכב לצל שלו',
    voiceover: 'אוטובוס ואופניים מתחבאים! גרור כל אחד לצל שלו!',
    config: {
      type: 'silhouette', subType: 'dragMatch',
      silhouettes: [
        { id: 'shadow-bus', emoji: '🚌', label: 'אוטובוס' },
        { id: 'shadow-bike', emoji: '🚲', label: 'אופניים' },
      ],
      options: [
        { id: 'bike', emoji: '🚲', label: 'אופניים' },
        { id: 'bus', emoji: '🚌', label: 'אוטובוס' },
      ],
      matches: { 'shadow-bus': 'bus', 'shadow-bike': 'bike' },
    },
    correctFeedback: 'האוטובוס במקום! ביפ ביפ!',
    incorrectFeedback: 'לא פה — תסתכל על הצורה!',
  },
  // --- Level 17: Shapes - find circle ---
  {
    id: 17, gameType: 'shapes', name: 'מצא את העיגול',
    instruction: 'לחץ על העיגול',
    voiceover: 'מצא את העיגול ולחץ עליו!',
    config: {
      type: 'shapes', subType: 'findShape', correctId: 'circle',
      targetShapeName: 'עיגול',
      shapes: [
        { id: 'circle', emoji: '🟠', label: 'עיגול', shape: 'circle' },
        { id: 'square', emoji: '🟩', label: 'ריבוע', shape: 'square' },
        { id: 'triangle', emoji: '🔺', label: 'משולש', shape: 'triangle' },
      ],
    },
    correctFeedback: 'יופי! זה עיגול! הוא עגול עגול!',
    incorrectFeedback: 'זה לא עיגול. העיגול הוא העגול — בלי פינות!',
  },
  // --- Level 18: Sorting - carrot to plate ---
  {
    id: 18, gameType: 'sorting', name: 'שים את הגזר בצלחת',
    instruction: 'גזר — שים אותו בצלחת או במגירה!',
    voiceover: 'גזר — אוכלים אותו? שים אותו בצלחת אם כן, או במגירה אם לא!',
    config: {
      type: 'sorting', subType: 'dragSort', singleObject: true,
      objects: [{ id: 'carrot', emoji: '🥕', label: 'גזר', edible: true }],
    },
    correctFeedback: 'יופי! גזר אוכלים!',
    incorrectFeedback: 'גזר אוכלים! שים אותו בצלחת!',
  },
  // --- Level 19: Silhouette - umbrella ---
  {
    id: 19, gameType: 'silhouette', name: 'צל של מטריה',
    instruction: 'מי מתחבא בצל?',
    voiceover: 'מה מתחבא בצל? בחר את התמונה הנכונה!',
    config: {
      type: 'silhouette', subType: 'tapMatch',
      silhouettes: [{ id: 'shadow-umbrella', emoji: '☂️', label: 'מטריה' }],
      options: [
        { id: 'umbrella', emoji: '☂️', label: 'מטריה' },
        { id: 'mushroom', emoji: '🍄', label: 'פטריה' },
        { id: 'tree', emoji: '🌳', label: 'עץ' },
      ],
      matches: { 'shadow-umbrella': 'umbrella' },
    },
    correctFeedback: 'מטריה! בשביל הגשם!',
    incorrectFeedback: 'תסתכל על הידית — זו מטריה!',
  },
  // --- Level 20: Counting - how many apples ---
  {
    id: 20, gameType: 'counting', name: 'כמה תפוחים?',
    instruction: 'כמה תפוחים יש על המסך?',
    voiceover: 'כמה תפוחים אתה רואה? לחץ על המספר הנכון!',
    config: {
      type: 'counting', subType: 'howMany', correctCount: 2, options: [1, 2, 3],
      objects: [
        { id: 'a1', emoji: '🍎', label: 'תפוח' },
        { id: 'a2', emoji: '🍎', label: 'תפוח' },
      ],
    },
    correctFeedback: 'כל הכבוד! יש 2 תפוחים!',
    incorrectFeedback: 'ננסה שוב! ספור איתי — אחת, שתיים!',
  },
  // --- Level 21: OddOneOut - not flying ---
  {
    id: 21, gameType: 'oddOneOut', name: 'מי לא עף?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'שלושה מהם — אחד לא שייך! מי לא יכול לעוף?',
    config: {
      type: 'oddOneOut', oddId: 'fish',
      objects: [
        { id: 'bird', emoji: '🐦', label: 'ציפור' },
        { id: 'butterfly', emoji: '🦋', label: 'פרפר' },
        { id: 'fish', emoji: '🐟', label: 'דג' },
      ],
    },
    correctFeedback: 'נכון! דג שוחה — הוא לא עף!',
    incorrectFeedback: 'ציפור ופרפר עפים — מי לא עף?',
  },
  // --- Level 22: Shapes - drag 3 shapes ---
  {
    id: 22, gameType: 'shapes', name: 'שים 3 צורות במקום',
    instruction: 'גרור כל צורה למקום שלה',
    voiceover: 'שים כל צורה במקום הנכון! גרור אותן!',
    config: {
      type: 'shapes', subType: 'dragShape', shapes: [], correctId: '',
      outlines: [
        { id: 'o-circle', emoji: '⭕', label: 'עיגול' },
        { id: 'o-square', emoji: '⬜', label: 'ריבוע' },
        { id: 'o-triangle', emoji: '△', label: 'משולש' },
      ],
      draggables: [
        { id: 'd-circle', emoji: '🔴', label: 'עיגול', shape: 'circle' },
        { id: 'd-square', emoji: '🟦', label: 'ריבוע', shape: 'square' },
        { id: 'd-triangle', emoji: '🔺', label: 'משולש', shape: 'triangle' },
      ],
    },
    correctFeedback: 'כל הצורות במקום! אלוף!',
    incorrectFeedback: 'לא פה — נסה מקום אחר!',
  },
  // --- Level 23: Silhouette - star ---
  {
    id: 23, gameType: 'silhouette', name: 'צל של כוכב',
    instruction: 'מי מתחבא בצל?',
    voiceover: 'מה הצורה שמתחבאת? לחץ על התמונה!',
    config: {
      type: 'silhouette', subType: 'tapMatch',
      silhouettes: [{ id: 'shadow-star', emoji: '⭐', label: 'כוכב' }],
      options: [
        { id: 'star', emoji: '⭐', label: 'כוכב' },
        { id: 'heart', emoji: '❤️', label: 'לב' },
        { id: 'circle', emoji: '⭕', label: 'עיגול' },
      ],
      matches: { 'shadow-star': 'star' },
    },
    correctFeedback: 'כוכב! הוא נוצץ!',
    incorrectFeedback: 'ספור את הקצוות — זה כוכב!',
  },
  // --- Level 24: OddOneOut - not from kitchen ---
  {
    id: 24, gameType: 'oddOneOut', name: 'מי לא מהמטבח?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'חמישה דברים! אחד לא מהמטבח. מצא אותו!',
    config: {
      type: 'oddOneOut', oddId: 'football',
      objects: [
        { id: 'pot', emoji: '🍲', label: 'סיר' },
        { id: 'ladle', emoji: '🥄', label: 'מצקת' },
        { id: 'plate', emoji: '🍽️', label: 'צלחת' },
        { id: 'glass', emoji: '🥛', label: 'כוס' },
        { id: 'football', emoji: '⚽', label: 'כדורגל' },
      ],
    },
    correctFeedback: 'נכון! כדורגל לא מהמטבח — הוא מהמגרש!',
    incorrectFeedback: 'סיר, מצקת, צלחת וכוס — כולם במטבח! מי לא?',
  },
  // --- Level 25: OddOneOut - not animal ---
  {
    id: 25, gameType: 'oddOneOut', name: 'מי לא חיה?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'שלושה דברים — אחד לא שייך! מי זה?',
    config: {
      type: 'oddOneOut', oddId: 'chair',
      objects: [
        { id: 'dog', emoji: '🐕', label: 'כלב' },
        { id: 'cat', emoji: '🐈', label: 'חתול' },
        { id: 'chair', emoji: '🪑', label: 'כיסא' },
      ],
    },
    correctFeedback: 'נכון! כלב וחתול הם חיות — כיסא לא!',
    incorrectFeedback: 'כלב וחתול — שניהם חיות! מה לא חיה?',
  },
  // --- Level 26: Silhouette - cat ---
  {
    id: 26, gameType: 'silhouette', name: 'צל של חתול',
    instruction: 'מי מתחבא בצל?',
    voiceover: 'מי מתחבא בצל הזה? לחץ על התמונה הנכונה!',
    config: {
      type: 'silhouette', subType: 'tapMatch',
      silhouettes: [{ id: 'shadow-cat', emoji: '🐈', label: 'חתול' }],
      options: [
        { id: 'cat', emoji: '🐈', label: 'חתול' },
        { id: 'dog', emoji: '🐕', label: 'כלב' },
      ],
      matches: { 'shadow-cat': 'cat' },
    },
    correctFeedback: 'מיאו! זה חתול!',
    incorrectFeedback: 'לא בדיוק — תסתכל על הצורה שוב!',
  },
  // --- Level 27: Sorting - find all food 5 ---
  {
    id: 27, gameType: 'sorting', name: 'מצא את כל האוכל — 5 דברים',
    instruction: 'לחץ על כל מה שאוכלים',
    voiceover: 'יש פה הרבה דברים! לחץ רק על מה שאוכלים!',
    config: {
      type: 'sorting', subType: 'multiSelect',
      objects: [
        { id: 'grapes', emoji: '🍇', label: 'ענבים', edible: true },
        { id: 'toothbrush', emoji: '🪥', label: 'מברשת שיניים', edible: false },
        { id: 'pizza', emoji: '🍕', label: 'פיצה', edible: true },
        { id: 'scissors', emoji: '✂️', label: 'מספריים', edible: false },
        { id: 'cheese', emoji: '🧀', label: 'גבינה', edible: true },
      ],
    },
    correctFeedback: 'מעולה! ענבים, פיצה וגבינה — אלה אוכל!',
    incorrectFeedback: 'לא אוכלים את זה! נסה שוב!',
  },
  // --- Level 28: Sorting - banana edible? ---
  {
    id: 28, gameType: 'sorting', name: 'בננה — אוכלים?',
    instruction: 'אפשר לאכול בננה?',
    voiceover: 'בננה — אפשר לאכול אותה? לחץ כן או לא!',
    config: {
      type: 'sorting', subType: 'yesNo', singleObject: true,
      objects: [{ id: 'banana', emoji: '🍌', label: 'בננה', edible: true }],
    },
    correctFeedback: 'ניאם! בננה טעימה!',
    incorrectFeedback: 'בננה? כן! אפשר לאכול בננה!',
  },
  // --- Level 29: Sorting - ice cream edible? ---
  {
    id: 29, gameType: 'sorting', name: 'גלידה — אוכלים?',
    instruction: 'אפשר לאכול גלידה?',
    voiceover: 'גלידה — אפשר לאכול? כן או לא?',
    config: {
      type: 'sorting', subType: 'yesNo', singleObject: true,
      objects: [{ id: 'icecream', emoji: '🍦', label: 'גלידה', edible: true }],
    },
    correctFeedback: 'כן! גלידה טעימה!',
    incorrectFeedback: 'גלידה? בטח שכן! אפשר לאכול גלידה!',
  },
  // --- Level 30: OddOneOut - not vegetable ---
  {
    id: 30, gameType: 'oddOneOut', name: 'מי לא ירקות?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'שלושה דברים! אחד לא שייך — מצא אותו!',
    config: {
      type: 'oddOneOut', oddId: 'bear',
      objects: [
        { id: 'carrot', emoji: '🥕', label: 'גזר' },
        { id: 'cucumber', emoji: '🥒', label: 'מלפפון' },
        { id: 'bear', emoji: '🧸', label: 'דובי צעצוע' },
      ],
    },
    correctFeedback: 'נכון! גזר ומלפפון הם ירקות — דובי הוא צעצוע!',
    incorrectFeedback: 'גזר ומלפפון גדלים באדמה — שניהם ירקות! מה לא ירק?',
  },
  // --- Level 31: OddOneOut - not instrument ---
  {
    id: 31, gameType: 'oddOneOut', name: 'מי לא כלי נגינה?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'ארבעה דברים! אחד מהם לא כלי נגינה! מצא אותו!',
    config: {
      type: 'oddOneOut', oddId: 'umbrella',
      objects: [
        { id: 'drum', emoji: '🥁', label: 'תוף' },
        { id: 'flute', emoji: '🎵', label: 'חליל' },
        { id: 'guitar', emoji: '🎸', label: 'גיטרה' },
        { id: 'umbrella', emoji: '☂️', label: 'מטריה' },
      ],
    },
    correctFeedback: 'נכון! מטריה היא לא כלי נגינה!',
    incorrectFeedback: 'תוף, חליל וגיטרה — כולם עושים מוזיקה! מי לא?',
  },
  // --- Level 32: Silhouette - guitar ---
  {
    id: 32, gameType: 'silhouette', name: 'צל של גיטרה',
    instruction: 'מי מתחבא בצל?',
    voiceover: 'כלי נגינה מתחבא! מי זה?',
    config: {
      type: 'silhouette', subType: 'tapMatch',
      silhouettes: [{ id: 'shadow-guitar', emoji: '🎸', label: 'גיטרה' }],
      options: [
        { id: 'guitar', emoji: '🎸', label: 'גיטרה' },
        { id: 'drum', emoji: '🥁', label: 'תוף' },
        { id: 'trumpet', emoji: '🎺', label: 'חצוצרה' },
        { id: 'piano', emoji: '🎹', label: 'פסנתר' },
      ],
      matches: { 'shadow-guitar': 'guitar' },
    },
    correctFeedback: 'גיטרה! שמעת את הצליל?',
    incorrectFeedback: 'תסתכל על הצורה — גוף ארוך עם חורים!',
  },
  // --- Level 33: Silhouette - flower ---
  {
    id: 33, gameType: 'silhouette', name: 'צל של פרח',
    instruction: 'מי מתחבא בצל?',
    voiceover: 'מה מתחבא בצל הזה? לחץ!',
    config: {
      type: 'silhouette', subType: 'tapMatch',
      silhouettes: [{ id: 'shadow-flower', emoji: '🌸', label: 'פרח' }],
      options: [
        { id: 'flower', emoji: '🌸', label: 'פרח' },
        { id: 'tree', emoji: '🌳', label: 'עץ' },
      ],
      matches: { 'shadow-flower': 'flower' },
    },
    correctFeedback: 'פרח! כמה יפה!',
    incorrectFeedback: 'תראה את העלי כותרת — זה פרח!',
  },
  // --- Level 34: OddOneOut - not vehicle ---
  {
    id: 34, gameType: 'oddOneOut', name: 'מי לא כלי רכב?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'ארבעה דברים! אחד לא שייך — מצא אותו!',
    config: {
      type: 'oddOneOut', oddId: 'apple',
      objects: [
        { id: 'car', emoji: '🚗', label: 'מכונית' },
        { id: 'bus', emoji: '🚌', label: 'אוטובוס' },
        { id: 'train', emoji: '🚂', label: 'רכבת' },
        { id: 'apple', emoji: '🍎', label: 'תפוח' },
      ],
    },
    correctFeedback: 'נכון! תפוח הוא פרי — לא כלי רכב!',
    incorrectFeedback: 'מכונית, אוטובוס ורכבת — כולם נוסעים! מי לא?',
  },
  // --- Level 35: Shapes - find star ---
  {
    id: 35, gameType: 'shapes', name: 'מצא את הכוכב',
    instruction: 'לחץ על הכוכב',
    voiceover: 'מצא את הכוכב ולחץ עליו!',
    config: {
      type: 'shapes', subType: 'findShape', correctId: 'star',
      targetShapeName: 'כוכב',
      shapes: [
        { id: 'star', emoji: '⭐', label: 'כוכב', shape: 'star' },
        { id: 'circle', emoji: '🔵', label: 'עיגול', shape: 'circle' },
        { id: 'square', emoji: '🟪', label: 'ריבוע', shape: 'square' },
        { id: 'heart', emoji: '❤️', label: 'לב', shape: 'heart' },
      ],
    },
    correctFeedback: 'כוכב! הוא נוצץ בשבילך!',
    incorrectFeedback: 'הכוכב הוא עם הקרניים!',
  },
  // --- Level 36: OddOneOut - not school ---
  {
    id: 36, gameType: 'oddOneOut', name: 'מי לא מבית הספר?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'חמישה דברים — מצא את מי שלא שייך!',
    config: {
      type: 'oddOneOut', oddId: 'lion',
      objects: [
        { id: 'pencil', emoji: '✏️', label: 'עיפרון' },
        { id: 'notebook', emoji: '📓', label: 'מחברת' },
        { id: 'colors', emoji: '🖍️', label: 'צבעים' },
        { id: 'eraser', emoji: '🧽', label: 'מחק' },
        { id: 'lion', emoji: '🦁', label: 'אריה' },
      ],
    },
    correctFeedback: 'נכון! אריה הוא לא מבית הספר!',
    incorrectFeedback: 'עיפרון, מחברת, צבעים ומחק — כולם לבית הספר! מי לא?',
  },
  // --- Level 37: OddOneOut - not water ---
  {
    id: 37, gameType: 'oddOneOut', name: 'מי לא גר במים?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'ארבע חיות! אחת לא גרה במים. מי זה?',
    config: {
      type: 'oddOneOut', oddId: 'cow',
      objects: [
        { id: 'fish', emoji: '🐟', label: 'דג' },
        { id: 'starfish', emoji: '⭐', label: 'כוכב ים' },
        { id: 'turtle', emoji: '🐢', label: 'צב ים' },
        { id: 'cow', emoji: '🐄', label: 'פרה' },
      ],
    },
    correctFeedback: 'נכון! פרה גרה ביבשה, לא במים!',
    incorrectFeedback: 'דג, כוכב ים וצב ים — כולם במים! מי לא?',
  },
  // --- Level 38: Counting - how many butterflies ---
  {
    id: 38, gameType: 'counting', name: 'כמה פרפרים?',
    instruction: 'כמה פרפרים יש?',
    voiceover: 'כמה פרפרים עפים? ספור ולחץ על המספר!',
    config: {
      type: 'counting', subType: 'howMany', correctCount: 1, options: [1, 2, 3],
      objects: [{ id: 'p1', emoji: '🦋', label: 'פרפר' }],
    },
    correctFeedback: 'נכון! פרפר אחד!',
    incorrectFeedback: 'תסתכל טוב — כמה פרפרים יש?',
  },
  // --- Level 39: Sorting - find all food 4 ---
  {
    id: 39, gameType: 'sorting', name: 'מצא את כל האוכל',
    instruction: 'לחץ על כל מה שאוכלים',
    voiceover: 'לחץ על כל הדברים שאפשר לאכול!',
    config: {
      type: 'sorting', subType: 'multiSelect',
      objects: [
        { id: 'apple', emoji: '🍎', label: 'תפוח', edible: true },
        { id: 'hat', emoji: '🧢', label: 'כובע', edible: false },
        { id: 'cookie', emoji: '🍪', label: 'עוגיה', edible: true },
        { id: 'cube', emoji: '🧊', label: 'קוביה', edible: false },
      ],
    },
    correctFeedback: 'כל הכבוד! תפוח ועוגיה — אלה דברים שאוכלים!',
    incorrectFeedback: 'לא אוכלים את זה!',
  },
  // --- Level 40: Silhouette - 2 animals drag ---
  {
    id: 40, gameType: 'silhouette', name: '2 צלליות — חיות',
    instruction: 'גרור כל חיה לצל שלה',
    voiceover: 'שתי חיות מתחבאות! גרור כל אחת לצל הנכון!',
    config: {
      type: 'silhouette', subType: 'dragMatch',
      silhouettes: [
        { id: 'shadow-cow', emoji: '🐄', label: 'פרה' },
        { id: 'shadow-hen', emoji: '🐔', label: 'תרנגולת' },
      ],
      options: [
        { id: 'hen', emoji: '🐔', label: 'תרנגולת' },
        { id: 'cow', emoji: '🐄', label: 'פרה' },
      ],
      matches: { 'shadow-cow': 'cow', 'shadow-hen': 'hen' },
    },
    correctFeedback: 'מו! הפרה במקום!',
    incorrectFeedback: 'לא הצל הזה — נסה את האחר!',
  },
  // --- Level 41: Counting - tap 2 flowers ---
  {
    id: 41, gameType: 'counting', name: 'לחץ על 2 פרחים',
    instruction: 'לחץ על 2 פרחים',
    voiceover: 'לחץ על שני פרחים!',
    config: {
      type: 'counting', subType: 'tapCount', correctCount: 2, tapTarget: 2, options: [],
      objects: [
        { id: 'fl1', emoji: '🌸', label: 'פרח' }, { id: 'fl2', emoji: '🌺', label: 'פרח' },
        { id: 'fl3', emoji: '🌻', label: 'פרח' }, { id: 'fl4', emoji: '💐', label: 'פרח' },
      ],
    },
    correctFeedback: 'בדיוק 2! כל הכבוד!',
    incorrectFeedback: 'אופס! ננסה שוב — רק שניים!',
  },
  // --- Level 42: Silhouette - rabbit ---
  {
    id: 42, gameType: 'silhouette', name: 'צל של ארנב',
    instruction: 'מי מתחבא?',
    voiceover: 'מי מתחבא בצל? תסתכל על הצורה!',
    config: {
      type: 'silhouette', subType: 'tapMatch',
      silhouettes: [{ id: 'shadow-rabbit', emoji: '🐇', label: 'ארנב' }],
      options: [
        { id: 'rabbit', emoji: '🐇', label: 'ארנב' },
        { id: 'cat', emoji: '🐈', label: 'חתול' },
        { id: 'dog', emoji: '🐕', label: 'כלב' },
      ],
      matches: { 'shadow-rabbit': 'rabbit' },
    },
    correctFeedback: 'קופצני! זה ארנב!',
    incorrectFeedback: 'תסתכל על האוזניים הארוכות — מי יש לו אוזניים כאלה?',
  },
  // --- Level 43: Counting - tap 3 cookies ---
  {
    id: 43, gameType: 'counting', name: 'לחץ על 3 עוגיות',
    instruction: 'לחץ על 3 עוגיות',
    voiceover: 'לחץ על שלוש עוגיות!',
    config: {
      type: 'counting', subType: 'tapCount', correctCount: 3, tapTarget: 3, options: [],
      objects: [
        { id: 'c1', emoji: '🍪', label: 'עוגיה' }, { id: 'c2', emoji: '🍪', label: 'עוגיה' },
        { id: 'c3', emoji: '🍪', label: 'עוגיה' }, { id: 'c4', emoji: '🍪', label: 'עוגיה' },
        { id: 'c5', emoji: '🍪', label: 'עוגיה' },
      ],
    },
    correctFeedback: 'ממש 3! אתה מספרן מעולה!',
    incorrectFeedback: 'עוד פעם! רק שלוש עוגיות!',
  },
  // --- Level 44: Counting - where is 3 ---
  {
    id: 44, gameType: 'counting', name: 'איפה יש 3?',
    instruction: 'איפה יש 3 חיפושיות?',
    voiceover: 'איפה יש שלוש חיפושיות? לחץ על הקבוצה הנכונה!',
    config: {
      type: 'counting', subType: 'whichGroup', correctCount: 3, options: [],
      objects: [],
      groups: {
        right: [{ id: 'r1', emoji: '🐞', label: 'חיפושית' }, { id: 'r2', emoji: '🐞', label: 'חיפושית' }],
        left: [
          { id: 'l1', emoji: '🐞', label: 'חיפושית' }, { id: 'l2', emoji: '🐞', label: 'חיפושית' },
          { id: 'l3', emoji: '🐞', label: 'חיפושית' },
        ],
      },
    },
    correctFeedback: 'נכון! 3 חיפושיות!',
    incorrectFeedback: 'בוא נספור — כאן יש אחת, שתיים. וכאן? אחת, שתיים, שלוש!',
  },
  // --- Level 45: Shapes - cake shape ---
  {
    id: 45, gameType: 'shapes', name: 'מה הצורה של העוגה?',
    instruction: 'מה הצורה של העוגה?',
    voiceover: 'העוגה הזו — מה הצורה שלה? עיגול, ריבוע, או משולש?',
    config: {
      type: 'shapes', subType: 'whatShape', correctId: 'circle',
      shapes: [{ id: 'cake', emoji: '🎂', label: 'עוגה', shape: 'circle' }],
      shapeOptions: [
        { id: 'circle', emoji: '⭕', label: 'עיגול' },
        { id: 'square', emoji: '⬜', label: 'ריבוע' },
        { id: 'triangle', emoji: '🔺', label: 'משולש' },
      ],
    },
    correctFeedback: 'נכון! העוגה עגולה כמו עיגול!',
    incorrectFeedback: 'תסתכל על העוגה — היא עגולה! כמו עיגול!',
  },
  // --- Level 46: Shapes - window shape ---
  {
    id: 46, gameType: 'shapes', name: 'מה הצורה של החלון?',
    instruction: 'מה הצורה של החלון?',
    voiceover: 'החלון הזה — מה הצורה שלו?',
    config: {
      type: 'shapes', subType: 'whatShape', correctId: 'square',
      shapes: [{ id: 'window', emoji: '🪟', label: 'חלון', shape: 'square' }],
      shapeOptions: [
        { id: 'circle', emoji: '⭕', label: 'עיגול' },
        { id: 'square', emoji: '⬜', label: 'ריבוע' },
        { id: 'triangle', emoji: '🔺', label: 'משולש' },
      ],
    },
    correctFeedback: 'נכון! החלון מרובע!',
    incorrectFeedback: 'לחלון יש ארבע פינות — הוא ריבוע!',
  },
  // --- Level 47: Shapes - drag circle+square ---
  {
    id: 47, gameType: 'shapes', name: 'שים את העיגול במקום',
    instruction: 'גרור את העיגול למקום שלו',
    voiceover: 'גרור את העיגול למקום הנכון!',
    config: {
      type: 'shapes', subType: 'dragShape', shapes: [], correctId: '',
      outlines: [
        { id: 'o-circle', emoji: '⭕', label: 'עיגול' },
        { id: 'o-square', emoji: '⬜', label: 'ריבוע' },
      ],
      draggables: [
        { id: 'd-circle', emoji: '🔴', label: 'עיגול', shape: 'circle' },
        { id: 'd-square', emoji: '🟦', label: 'ריבוע', shape: 'square' },
      ],
    },
    correctFeedback: 'מושלם! העיגול במקום!',
    incorrectFeedback: 'לא בדיוק — נסה את המקום האחר!',
  },
  // --- Level 48: Counting - how many stars ---
  {
    id: 48, gameType: 'counting', name: 'כמה כוכבים?',
    instruction: 'כמה כוכבים יש?',
    voiceover: 'כמה כוכבים יש? ספור ולחץ!',
    config: {
      type: 'counting', subType: 'howMany', correctCount: 3, options: [2, 3, 4],
      objects: [
        { id: 's1', emoji: '⭐', label: 'כוכב' }, { id: 's2', emoji: '⭐', label: 'כוכב' },
        { id: 's3', emoji: '⭐', label: 'כוכב' },
      ],
    },
    correctFeedback: 'מעולה! 3 כוכבים!',
    incorrectFeedback: 'בוא נספור ביחד!',
  },
  // --- Level 49: Counting - tap 4 birds ---
  {
    id: 49, gameType: 'counting', name: 'לחץ על 4 ציפורים',
    instruction: 'לחץ על 4 ציפורים',
    voiceover: 'לחץ על ארבע ציפורים!',
    config: {
      type: 'counting', subType: 'tapCount', correctCount: 4, tapTarget: 4, options: [],
      objects: [
        { id: 'b1', emoji: '🐦', label: 'ציפור' }, { id: 'b2', emoji: '🐦', label: 'ציפור' },
        { id: 'b3', emoji: '🐦', label: 'ציפור' }, { id: 'b4', emoji: '🐦', label: 'ציפור' },
        { id: 'b5', emoji: '🐦', label: 'ציפור' }, { id: 'b6', emoji: '🐦', label: 'ציפור' },
      ],
    },
    correctFeedback: '4 ציפורים! מושלם!',
    incorrectFeedback: 'רק ארבע! ננסה שוב!',
  },
  // --- Level 50: OddOneOut - not fruit (FINALE) ---
  {
    id: 50, gameType: 'oddOneOut', name: 'מי לא פרי?',
    instruction: 'איזה עצם לא שייך?',
    voiceover: 'השלב האחרון! שלושה דברים! אחד לא שייך — מי זה? לחץ עליו!',
    config: {
      type: 'oddOneOut', oddId: 'car',
      objects: [
        { id: 'apple', emoji: '🍎', label: 'תפוח' },
        { id: 'banana', emoji: '🍌', label: 'בננה' },
        { id: 'car', emoji: '🚗', label: 'מכונית' },
      ],
    },
    correctFeedback: 'מדהים! סיימת את כל המשחק! אתה אלוף אמיתי!',
    incorrectFeedback: 'תפוח ובננה דומים — שניהם פירות! מי לא פרי?',
  },

  // =============================================
  // Visual Odd One Out (51–70)
  // =============================================

  {
    id: 51, gameType: 'visualOddOneOut', name: 'העיגול הכחול',
    instruction: 'מי בצבע אחר?',
    voiceover: 'ארבעה עיגולים — אחד בצבע אחר! מצא אותו!',
    config: {
      type: 'visualOddOneOut', oddType: 'color', oddIndex: 3,
      items: [
        { id: 'v51-1', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v51-2', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v51-3', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v51-4', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'כל הכבוד! העיגול הכחול שונה מהאדומים!',
    incorrectFeedback: 'חפש את העיגול שבצבע שונה!',
  },
  {
    id: 52, gameType: 'visualOddOneOut', name: 'הכוכב הירוק',
    instruction: 'מי בצבע אחר?',
    voiceover: 'ארבעה כוכבים — מי בצבע שונה?',
    config: {
      type: 'visualOddOneOut', oddType: 'color', oddIndex: 1,
      items: [
        { id: 'v52-1', shape: 'star', color: '#EAB308', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v52-2', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v52-3', shape: 'star', color: '#EAB308', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v52-4', shape: 'star', color: '#EAB308', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'יופי! הכוכב הירוק שונה מהצהובים!',
    incorrectFeedback: 'חפש את הכוכב שבצבע שונה!',
  },
  {
    id: 53, gameType: 'visualOddOneOut', name: 'הריבוע הסגול',
    instruction: 'מי בצבע אחר?',
    voiceover: 'חמישה ריבועים — מי בצבע אחר? מצא אותו!',
    config: {
      type: 'visualOddOneOut', oddType: 'color', oddIndex: 2,
      items: [
        { id: 'v53-1', shape: 'square', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v53-2', shape: 'square', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v53-3', shape: 'square', color: '#8B5CF6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v53-4', shape: 'square', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v53-5', shape: 'square', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'מדהים! הריבוע הסגול שונה מהכתומים!',
    incorrectFeedback: 'חפש ריבוע בצבע אחר!',
  },
  {
    id: 54, gameType: 'visualOddOneOut', name: 'הלב האדום',
    instruction: 'מי בצבע אחר?',
    voiceover: 'ארבעה לבבות — מי בצבע שונה?',
    config: {
      type: 'visualOddOneOut', oddType: 'color', oddIndex: 0,
      items: [
        { id: 'v54-1', shape: 'heart', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v54-2', shape: 'heart', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v54-3', shape: 'heart', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v54-4', shape: 'heart', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'נכון! הלב האדום שונה מהירוקים!',
    incorrectFeedback: 'חפש את הלב שבצבע שונה!',
  },
  {
    id: 55, gameType: 'visualOddOneOut', name: 'העיגול הקטן',
    instruction: 'מי בגודל אחר?',
    voiceover: 'ארבעה עיגולים — מי בגודל שונה?',
    config: {
      type: 'visualOddOneOut', oddType: 'size', oddIndex: 2,
      items: [
        { id: 'v55-1', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v55-2', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v55-3', shape: 'circle', color: '#3B82F6', size: 0.55, rotation: 0, fill: 'solid' },
        { id: 'v55-4', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'כל הכבוד! העיגול הקטן שונה מהגדולים!',
    incorrectFeedback: 'חפש עיגול בגודל אחר!',
  },
  {
    id: 56, gameType: 'visualOddOneOut', name: 'הריבוע הקטן',
    instruction: 'מי בגודל אחר?',
    voiceover: 'ארבעה ריבועים — מי הכי שונה בגודל?',
    config: {
      type: 'visualOddOneOut', oddType: 'size', oddIndex: 3,
      items: [
        { id: 'v56-1', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v56-2', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v56-3', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v56-4', shape: 'square', color: '#EF4444', size: 0.55, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'יופי! הריבוע הקטן שונה מהגדולים!',
    incorrectFeedback: 'חפש ריבוע בגודל שונה!',
  },
  {
    id: 57, gameType: 'visualOddOneOut', name: 'הכוכב הגדול',
    instruction: 'מי בגודל אחר?',
    voiceover: 'חמישה כוכבים — מי בגודל שונה? לחץ עליו!',
    config: {
      type: 'visualOddOneOut', oddType: 'size', oddIndex: 4,
      items: [
        { id: 'v57-1', shape: 'star', color: '#EAB308', size: 0.65, rotation: 0, fill: 'solid' },
        { id: 'v57-2', shape: 'star', color: '#EAB308', size: 0.65, rotation: 0, fill: 'solid' },
        { id: 'v57-3', shape: 'star', color: '#EAB308', size: 0.65, rotation: 0, fill: 'solid' },
        { id: 'v57-4', shape: 'star', color: '#EAB308', size: 0.65, rotation: 0, fill: 'solid' },
        { id: 'v57-5', shape: 'star', color: '#EAB308', size: 1.2, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'מדהים! הכוכב הגדול שונה מהקטנים!',
    incorrectFeedback: 'חפש כוכב בגודל שונה!',
  },
  {
    id: 58, gameType: 'visualOddOneOut', name: 'הריבוע בין העיגולים',
    instruction: 'מי בצורה אחרת?',
    voiceover: 'ארבעה דברים — מי בצורה שונה?',
    config: {
      type: 'visualOddOneOut', oddType: 'shape', oddIndex: 1,
      items: [
        { id: 'v58-1', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v58-2', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v58-3', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v58-4', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'נכון! הריבוע שונה מהעיגולים!',
    incorrectFeedback: 'חפש את מי שבצורה שונה!',
  },
  {
    id: 59, gameType: 'visualOddOneOut', name: 'העיגול בין המשולשים',
    instruction: 'מי בצורה אחרת?',
    voiceover: 'ארבע צורות — מי שונה? לחץ עליו!',
    config: {
      type: 'visualOddOneOut', oddType: 'shape', oddIndex: 3,
      items: [
        { id: 'v59-1', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v59-2', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v59-3', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v59-4', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'יופי! העיגול שונה מהמשולשים!',
    incorrectFeedback: 'חפש צורה שונה מהאחרות!',
  },
  {
    id: 60, gameType: 'visualOddOneOut', name: 'הכוכב בין הריבועים',
    instruction: 'מי בצורה אחרת?',
    voiceover: 'חמש צורות — מצא את מי שבצורה שונה!',
    config: {
      type: 'visualOddOneOut', oddType: 'shape', oddIndex: 2,
      items: [
        { id: 'v60-1', shape: 'square', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v60-2', shape: 'square', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v60-3', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v60-4', shape: 'square', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v60-5', shape: 'square', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'מדהים! הכוכב שונה מהריבועים!',
    incorrectFeedback: 'חפש צורה שונה!',
  },
  {
    id: 61, gameType: 'visualOddOneOut', name: 'החץ ההפוך',
    instruction: 'מי פונה לכיוון אחר?',
    voiceover: 'ארבעה חיצים — מי פונה לכיוון אחר?',
    config: {
      type: 'visualOddOneOut', oddType: 'direction', oddIndex: 2,
      items: [
        { id: 'v61-1', shape: 'arrow', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v61-2', shape: 'arrow', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v61-3', shape: 'arrow', color: '#3B82F6', size: 1, rotation: 180, fill: 'solid' },
        { id: 'v61-4', shape: 'arrow', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'כל הכבוד! החץ הזה פונה לכיוון אחר!',
    incorrectFeedback: 'חפש את החץ שפונה לצד שונה!',
  },
  {
    id: 62, gameType: 'visualOddOneOut', name: 'החץ שמסתכל למטה',
    instruction: 'מי פונה לכיוון אחר?',
    voiceover: 'ארבעה חיצים — מי מסתכל לכיוון אחר?',
    config: {
      type: 'visualOddOneOut', oddType: 'direction', oddIndex: 0,
      items: [
        { id: 'v62-1', shape: 'arrow', color: '#EF4444', size: 1, rotation: 90, fill: 'solid' },
        { id: 'v62-2', shape: 'arrow', color: '#EF4444', size: 1, rotation: -90, fill: 'solid' },
        { id: 'v62-3', shape: 'arrow', color: '#EF4444', size: 1, rotation: -90, fill: 'solid' },
        { id: 'v62-4', shape: 'arrow', color: '#EF4444', size: 1, rotation: -90, fill: 'solid' },
      ],
    },
    correctFeedback: 'נכון! החץ הזה מסתכל למטה!',
    incorrectFeedback: 'חפש את החץ שפונה לכיוון שונה!',
  },
  {
    id: 63, gameType: 'visualOddOneOut', name: 'המשולש ההפוך',
    instruction: 'מי פונה לכיוון אחר?',
    voiceover: 'חמישה משולשים — מי הפוך?',
    config: {
      type: 'visualOddOneOut', oddType: 'direction', oddIndex: 4,
      items: [
        { id: 'v63-1', shape: 'triangle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v63-2', shape: 'triangle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v63-3', shape: 'triangle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v63-4', shape: 'triangle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v63-5', shape: 'triangle', color: '#22C55E', size: 1, rotation: 180, fill: 'solid' },
      ],
    },
    correctFeedback: 'יופי! המשולש הזה הפוך!',
    incorrectFeedback: 'חפש את המשולש שמסתכל לכיוון אחר!',
  },
  {
    id: 64, gameType: 'visualOddOneOut', name: 'העיגול הריק',
    instruction: 'מי נראה אחרת?',
    voiceover: 'ארבעה עיגולים — מי נראה שונה?',
    config: {
      type: 'visualOddOneOut', oddType: 'fill', oddIndex: 1,
      items: [
        { id: 'v64-1', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v64-2', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'outline' },
        { id: 'v64-3', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v64-4', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'כל הכבוד! העיגול הזה ריק בפנים!',
    incorrectFeedback: 'חפש את העיגול שנראה אחרת!',
  },
  {
    id: 65, gameType: 'visualOddOneOut', name: 'הריבוע הריק',
    instruction: 'מי נראה אחרת?',
    voiceover: 'ארבעה ריבועים — מי שונה?',
    config: {
      type: 'visualOddOneOut', oddType: 'fill', oddIndex: 3,
      items: [
        { id: 'v65-1', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v65-2', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v65-3', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v65-4', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'outline' },
      ],
    },
    correctFeedback: 'נכון! הריבוע הזה ריק בפנים!',
    incorrectFeedback: 'חפש ריבוע שנראה שונה מהאחרים!',
  },
  {
    id: 66, gameType: 'visualOddOneOut', name: 'הכוכב המלא',
    instruction: 'מי נראה אחרת?',
    voiceover: 'חמישה כוכבים — מי שונה מהאחרים?',
    config: {
      type: 'visualOddOneOut', oddType: 'fill', oddIndex: 0,
      items: [
        { id: 'v66-1', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v66-2', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'outline' },
        { id: 'v66-3', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'outline' },
        { id: 'v66-4', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'outline' },
        { id: 'v66-5', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'outline' },
      ],
    },
    correctFeedback: 'מדהים! הכוכב הזה מלא בפנים!',
    incorrectFeedback: 'חפש כוכב שנראה שונה!',
  },
  {
    id: 67, gameType: 'visualOddOneOut', name: 'הריבוע המוטה',
    instruction: 'מי מסובב?',
    voiceover: 'ארבעה ריבועים — מי מסובב?',
    config: {
      type: 'visualOddOneOut', oddType: 'rotation', oddIndex: 2,
      items: [
        { id: 'v67-1', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v67-2', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v67-3', shape: 'square', color: '#EF4444', size: 1, rotation: 45, fill: 'solid' },
        { id: 'v67-4', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'כל הכבוד! הריבוע הזה מסובב!',
    incorrectFeedback: 'חפש את הריבוע שעומד אחרת!',
  },
  {
    id: 68, gameType: 'visualOddOneOut', name: 'המשולש המוטה',
    instruction: 'מי מסובב?',
    voiceover: 'ארבעה משולשים — מי מסובב? לחץ עליו!',
    config: {
      type: 'visualOddOneOut', oddType: 'rotation', oddIndex: 3,
      items: [
        { id: 'v68-1', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v68-2', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v68-3', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v68-4', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 90, fill: 'solid' },
      ],
    },
    correctFeedback: 'נכון! המשולש הזה מסובב!',
    incorrectFeedback: 'חפש משולש שעומד אחרת!',
  },
  {
    id: 69, gameType: 'visualOddOneOut', name: 'המעוין המוטה',
    instruction: 'מי מסובב?',
    voiceover: 'חמישה מעויינים — מי מסובב?',
    config: {
      type: 'visualOddOneOut', oddType: 'rotation', oddIndex: 1,
      items: [
        { id: 'v69-1', shape: 'diamond', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v69-2', shape: 'diamond', color: '#22C55E', size: 1, rotation: 45, fill: 'solid' },
        { id: 'v69-3', shape: 'diamond', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v69-4', shape: 'diamond', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v69-5', shape: 'diamond', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'יופי! המעוין הזה מסובב!',
    incorrectFeedback: 'חפש מעוין שנראה מוטה!',
  },
  {
    id: 70, gameType: 'visualOddOneOut', name: 'הלב המוטה',
    instruction: 'מי מסובב?',
    voiceover: 'ארבעה לבבות — מי מסובב? מצא אותו!',
    config: {
      type: 'visualOddOneOut', oddType: 'rotation', oddIndex: 2,
      items: [
        { id: 'v70-1', shape: 'heart', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v70-2', shape: 'heart', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 'v70-3', shape: 'heart', color: '#EC4899', size: 1, rotation: 35, fill: 'solid' },
        { id: 'v70-4', shape: 'heart', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
      ],
    },
    correctFeedback: 'מדהים! הלב הזה מוטה!',
    incorrectFeedback: 'חפש את הלב שעומד אחרת!',
  },

  // =============================================
  // Series (71–90)
  // =============================================

  {
    id: 71, gameType: 'series', name: 'אדום כחול',
    instruction: 'מה חסר בסוף?',
    voiceover: 'תסתכל טוב. מה חסר בסוף?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'color', missingIndex: 3,
      sequence: [
        { id: 's71-1', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's71-2', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's71-3', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's71-blue', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's71-green', shape: 'circle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's71-blue',
    },
    correctFeedback: 'יופי! הכחול בא עכשיו!',
    incorrectFeedback: 'כמעט! ננסה שוב.',
  },
  {
    id: 72, gameType: 'series', name: 'ריבוע עיגול',
    instruction: 'מה בא עכשיו?',
    voiceover: 'מה בא עכשיו?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'shape', missingIndex: 3,
      sequence: [
        { id: 's72-1', shape: 'square', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's72-2', shape: 'circle', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's72-3', shape: 'square', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's72-circle', shape: 'circle', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's72-triangle', shape: 'triangle', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's72-circle',
    },
    correctFeedback: 'נכון! עכשיו בא עיגול!',
    incorrectFeedback: 'כמעט! בוא נבדוק שוב.',
  },
  {
    id: 73, gameType: 'series', name: 'גדול קטן',
    instruction: 'מה חסר בסוף?',
    voiceover: 'מי בא עכשיו? הגדול או הקטן?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'size', missingIndex: 3,
      sequence: [
        { id: 's73-1', shape: 'star', color: '#EAB308', size: 1.15, rotation: 0, fill: 'solid' },
        { id: 's73-2', shape: 'star', color: '#EAB308', size: 0.62, rotation: 0, fill: 'solid' },
        { id: 's73-3', shape: 'star', color: '#EAB308', size: 1.15, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's73-small', shape: 'star', color: '#EAB308', size: 0.62, rotation: 0, fill: 'solid' },
        { id: 's73-big', shape: 'star', color: '#EAB308', size: 1.15, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's73-small',
    },
    correctFeedback: 'יפה! עכשיו בא הקטן!',
    incorrectFeedback: 'כמעט! תסתכל על הגדלים.',
  },
  {
    id: 74, gameType: 'series', name: 'ימינה שמאלה',
    instruction: 'מה חסר בסוף?',
    voiceover: 'איזה חץ בא עכשיו?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'direction', missingIndex: 3,
      sequence: [
        { id: 's74-1', shape: 'arrow', color: '#8B5CF6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's74-2', shape: 'arrow', color: '#8B5CF6', size: 1, rotation: 180, fill: 'solid' },
        { id: 's74-3', shape: 'arrow', color: '#8B5CF6', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's74-left', shape: 'arrow', color: '#8B5CF6', size: 1, rotation: 180, fill: 'solid' },
        { id: 's74-up', shape: 'arrow', color: '#8B5CF6', size: 1, rotation: -90, fill: 'solid' },
      ],
      correctOptionId: 's74-left',
    },
    correctFeedback: 'מצוין! עכשיו שמאלה!',
    incorrectFeedback: 'כמעט! תראה לאן החץ פונה.',
  },
  {
    id: 75, gameType: 'series', name: 'לבבות בזוגות',
    instruction: 'מה חסר בסוף?',
    voiceover: 'תראה את הזוגות. מה חסר?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'color', missingIndex: 5,
      sequence: [
        { id: 's75-1', shape: 'heart', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's75-2', shape: 'heart', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's75-3', shape: 'heart', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 's75-4', shape: 'heart', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 's75-5', shape: 'heart', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's75-red', shape: 'heart', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's75-green', shape: 'heart', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's75-red',
    },
    correctFeedback: 'כל הכבוד! עוד אדום!',
    incorrectFeedback: 'כמעט! תראה איך הם באים בזוגות.',
  },
  {
    id: 76, gameType: 'series', name: 'שלוש צורות',
    instruction: 'מה חסר בסוף?',
    voiceover: 'מה בא אחרי ריבוע?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'shape', missingIndex: 5,
      sequence: [
        { id: 's76-1', shape: 'circle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        { id: 's76-2', shape: 'square', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        { id: 's76-3', shape: 'triangle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        { id: 's76-4', shape: 'circle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        { id: 's76-5', shape: 'square', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's76-triangle', shape: 'triangle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        { id: 's76-circle', shape: 'circle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        { id: 's76-star', shape: 'star', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's76-triangle',
    },
    correctFeedback: 'יופי! עכשיו בא משולש!',
    incorrectFeedback: 'כמעט! בוא נסתכל מה חוזר.',
  },
  {
    id: 77, gameType: 'series', name: 'שלושה צבעים',
    instruction: 'מה חסר בסוף?',
    voiceover: 'איזה צבע בא עכשיו?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'color', missingIndex: 5,
      sequence: [
        { id: 's77-1', shape: 'star', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's77-2', shape: 'star', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's77-3', shape: 'star', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's77-4', shape: 'star', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's77-5', shape: 'star', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's77-blue', shape: 'star', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's77-green', shape: 'star', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 's77-red', shape: 'star', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's77-blue',
    },
    correctFeedback: 'נכון! עכשיו בא כחול!',
    incorrectFeedback: 'כמעט! תראה את הצבעים שחוזרים.',
  },
  {
    id: 78, gameType: 'series', name: 'צורות בזוגות',
    instruction: 'מה חסר בסוף?',
    voiceover: 'תראה את הזוגות. מה בא עכשיו?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'shape', missingIndex: 5,
      sequence: [
        { id: 's78-1', shape: 'circle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's78-2', shape: 'circle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's78-3', shape: 'triangle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's78-4', shape: 'triangle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's78-5', shape: 'circle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's78-circle', shape: 'circle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's78-triangle', shape: 'triangle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's78-square', shape: 'square', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's78-circle',
    },
    correctFeedback: 'יפה מאוד! שוב עיגול!',
    incorrectFeedback: 'כמעט! הם באים שניים שניים.',
  },
  {
    id: 79, gameType: 'series', name: 'גרור את החסר',
    instruction: 'בחר ושים בסוף',
    voiceover: 'בחר את מה שחסר, ואז שים אותו בסוף.',
    config: {
      type: 'series', subType: 'dragToSlot', ruleType: 'color', missingIndex: 3,
      sequence: [
        { id: 's79-1', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's79-2', shape: 'square', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's79-3', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's79-pink', shape: 'square', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's79-blue', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's79-pink',
    },
    correctFeedback: 'יופי! השלמת את הסדרה!',
    incorrectFeedback: 'כמעט! ננסה עוד פעם.',
  },
  {
    id: 80, gameType: 'series', name: 'סדרה ארוכה',
    instruction: 'בחר ושים בסוף',
    voiceover: 'הסדרה כמעט גמורה. בחר את מה שחסר ושים אותו בסוף.',
    config: {
      type: 'series', subType: 'dragToSlot', ruleType: 'mixedToken', missingIndex: 5,
      sequence: [
        { id: 's80-1', shape: 'heart', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's80-2', shape: 'star', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's80-3', shape: 'circle', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's80-4', shape: 'heart', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's80-5', shape: 'star', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's80-circle', shape: 'circle', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's80-heart', shape: 'heart', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
        { id: 's80-star', shape: 'star', color: '#FACC15', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's80-circle',
    },
    correctFeedback: 'מדהים! הסדרה הושלמה!',
    incorrectFeedback: 'כמעט! תסתכל מה חוזר.',
  },
  {
    id: 81, gameType: 'series', name: 'חצים בזוגות',
    instruction: 'מה חסר בסוף?',
    voiceover: 'תראה את החיצים בזוגות. מה חסר בסוף?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'direction', missingIndex: 5,
      sequence: [
        { id: 's81-1', shape: 'arrow', color: '#22C55E', size: 1, rotation: -90, fill: 'solid' },
        { id: 's81-2', shape: 'arrow', color: '#22C55E', size: 1, rotation: -90, fill: 'solid' },
        { id: 's81-3', shape: 'arrow', color: '#22C55E', size: 1, rotation: 90, fill: 'solid' },
        { id: 's81-4', shape: 'arrow', color: '#22C55E', size: 1, rotation: 90, fill: 'solid' },
        { id: 's81-5', shape: 'arrow', color: '#22C55E', size: 1, rotation: -90, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's81-up', shape: 'arrow', color: '#22C55E', size: 1, rotation: -90, fill: 'solid' },
        { id: 's81-down', shape: 'arrow', color: '#22C55E', size: 1, rotation: 90, fill: 'solid' },
        { id: 's81-right', shape: 'arrow', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's81-up',
    },
    correctFeedback: 'נכון! שוב למעלה!',
    incorrectFeedback: 'כמעט! תראה איך הכיוון חוזר.',
  },
  {
    id: 82, gameType: 'series', name: 'גדולים וקטנים',
    instruction: 'מה חסר בסוף?',
    voiceover: 'תראה את הגדולים והקטנים. מה בא עכשיו?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'size', missingIndex: 5,
      sequence: [
        { id: 's82-1', shape: 'circle', color: '#3B82F6', size: 1.15, rotation: 0, fill: 'solid' },
        { id: 's82-2', shape: 'circle', color: '#3B82F6', size: 1.15, rotation: 0, fill: 'solid' },
        { id: 's82-3', shape: 'circle', color: '#3B82F6', size: 0.6, rotation: 0, fill: 'solid' },
        { id: 's82-4', shape: 'circle', color: '#3B82F6', size: 0.6, rotation: 0, fill: 'solid' },
        { id: 's82-5', shape: 'circle', color: '#3B82F6', size: 1.15, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's82-big', shape: 'circle', color: '#3B82F6', size: 1.15, rotation: 0, fill: 'solid' },
        { id: 's82-small', shape: 'circle', color: '#3B82F6', size: 0.6, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's82-big',
    },
    correctFeedback: 'יפה! שוב גדול!',
    incorrectFeedback: 'כמעט! תראה מי באים שניים שניים.',
  },
  {
    id: 83, gameType: 'series', name: 'שני חברים',
    instruction: 'מה חסר בסוף?',
    voiceover: 'מי בא עכשיו?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'mixedToken', missingIndex: 5,
      sequence: [
        { id: 's83-1', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's83-2', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's83-3', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's83-4', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's83-5', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's83-square-blue', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's83-circle-blue', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's83-square-red', shape: 'square', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's83-square-blue',
    },
    correctFeedback: 'נכון! עכשיו בא הריבוע הכחול!',
    incorrectFeedback: 'כמעט! תראה מי חוזר אחרי מי.',
  },
  {
    id: 84, gameType: 'series', name: 'מלא ריק',
    instruction: 'מה חסר בסוף?',
    voiceover: 'מי בא עכשיו? המלא או הריק?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'mixedToken', missingIndex: 3,
      sequence: [
        { id: 's84-1', shape: 'star', color: '#F59E0B', size: 1, rotation: 0, fill: 'solid' },
        { id: 's84-2', shape: 'star', color: '#F59E0B', size: 1, rotation: 0, fill: 'outline' },
        { id: 's84-3', shape: 'star', color: '#F59E0B', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's84-outline', shape: 'star', color: '#F59E0B', size: 1, rotation: 0, fill: 'outline' },
        { id: 's84-solid', shape: 'star', color: '#F59E0B', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's84-outline',
    },
    correctFeedback: 'יופי! עכשיו בא הריק!',
    incorrectFeedback: 'כמעט! תראה מי מלא ומי ריק.',
  },
  {
    id: 85, gameType: 'series', name: 'לב כוכב ריבוע',
    instruction: 'מה חסר בסוף?',
    voiceover: 'מה בא עכשיו?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'shape', missingIndex: 5,
      sequence: [
        { id: 's85-1', shape: 'heart', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's85-2', shape: 'star', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's85-3', shape: 'square', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's85-4', shape: 'heart', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's85-5', shape: 'star', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's85-square', shape: 'square', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's85-heart', shape: 'heart', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
        { id: 's85-circle', shape: 'circle', color: '#EC4899', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's85-square',
    },
    correctFeedback: 'נכון! עכשיו בא ריבוע!',
    incorrectFeedback: 'כמעט! תראה מה חוזר כל פעם.',
  },
  {
    id: 86, gameType: 'series', name: 'בחר ושים חץ',
    instruction: 'בחר ושים בסוף',
    voiceover: 'בחר את החץ שחסר, ואז שים אותו בסוף.',
    config: {
      type: 'series', subType: 'dragToSlot', ruleType: 'direction', missingIndex: 3,
      sequence: [
        { id: 's86-1', shape: 'arrow', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's86-2', shape: 'arrow', color: '#EF4444', size: 1, rotation: 180, fill: 'solid' },
        { id: 's86-3', shape: 'arrow', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's86-left', shape: 'arrow', color: '#EF4444', size: 1, rotation: 180, fill: 'solid' },
        { id: 's86-right', shape: 'arrow', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's86-left',
    },
    correctFeedback: 'יופי! הסדרה הושלמה!',
    incorrectFeedback: 'כמעט! תראה לאן החץ פונה.',
  },
  {
    id: 87, gameType: 'series', name: 'בחר ושים גודל',
    instruction: 'בחר ושים בסוף',
    voiceover: 'בחר את הגודל שחסר, ואז שים אותו בסוף.',
    config: {
      type: 'series', subType: 'dragToSlot', ruleType: 'size', missingIndex: 3,
      sequence: [
        { id: 's87-1', shape: 'diamond', color: '#22C55E', size: 1.12, rotation: 0, fill: 'solid' },
        { id: 's87-2', shape: 'diamond', color: '#22C55E', size: 0.62, rotation: 0, fill: 'solid' },
        { id: 's87-3', shape: 'diamond', color: '#22C55E', size: 1.12, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's87-small', shape: 'diamond', color: '#22C55E', size: 0.62, rotation: 0, fill: 'solid' },
        { id: 's87-big', shape: 'diamond', color: '#22C55E', size: 1.12, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's87-small',
    },
    correctFeedback: 'יפה! עכשיו בא הקטן!',
    incorrectFeedback: 'כמעט! תסתכל על הגודל.',
  },
  {
    id: 88, gameType: 'series', name: 'שלושה צבעים ארוך',
    instruction: 'בחר ושים בסוף',
    voiceover: 'איזה צבע חסר? בחר ושים בסוף.',
    config: {
      type: 'series', subType: 'dragToSlot', ruleType: 'color', missingIndex: 5,
      sequence: [
        { id: 's88-1', shape: 'circle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 's88-2', shape: 'circle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        { id: 's88-3', shape: 'circle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's88-4', shape: 'circle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 's88-5', shape: 'circle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's88-orange', shape: 'circle', color: '#F97316', size: 1, rotation: 0, fill: 'solid' },
        { id: 's88-green', shape: 'circle', color: '#22C55E', size: 1, rotation: 0, fill: 'solid' },
        { id: 's88-purple', shape: 'circle', color: '#A855F7', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's88-orange',
    },
    correctFeedback: 'נכון! עכשיו בא הכתום!',
    incorrectFeedback: 'כמעט! תראה את הצבעים שחוזרים.',
  },
  {
    id: 89, gameType: 'series', name: 'מלאים וריקים בזוגות',
    instruction: 'מה חסר בסוף?',
    voiceover: 'תראה את הזוגות. מה חסר בסוף?',
    config: {
      type: 'series', subType: 'tapChoice', ruleType: 'mixedToken', missingIndex: 5,
      sequence: [
        { id: 's89-1', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's89-2', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's89-3', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'outline' },
        { id: 's89-4', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'outline' },
        { id: 's89-5', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's89-solid', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's89-outline', shape: 'square', color: '#3B82F6', size: 1, rotation: 0, fill: 'outline' },
      ],
      correctOptionId: 's89-solid',
    },
    correctFeedback: 'כל הכבוד! שוב מלא!',
    incorrectFeedback: 'כמעט! תראה איך הם באים בזוגות.',
  },
  {
    id: 90, gameType: 'series', name: 'השלם את הסדרה',
    instruction: 'בחר ושים בסוף',
    voiceover: 'הסדרה כמעט גמורה. בחר את מה שחסר ושים בסוף.',
    config: {
      type: 'series', subType: 'dragToSlot', ruleType: 'mixedToken', missingIndex: 5,
      sequence: [
        { id: 's90-1', shape: 'triangle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's90-2', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's90-3', shape: 'triangle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        { id: 's90-4', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's90-5', shape: 'triangle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
        null,
      ],
      options: [
        { id: 's90-circle-blue', shape: 'circle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's90-triangle-blue', shape: 'triangle', color: '#3B82F6', size: 1, rotation: 0, fill: 'solid' },
        { id: 's90-circle-red', shape: 'circle', color: '#EF4444', size: 1, rotation: 0, fill: 'solid' },
      ],
      correctOptionId: 's90-circle-blue',
    },
    correctFeedback: 'מדהים! השלמת את כל הסדרות!',
    incorrectFeedback: 'כמעט! תראה מי חוזר כל פעם.',
  },

  // =============================================
  // Initial Sound (91–110) & Quantity Match (111–130)
  // =============================================

  ...initialSoundLevels,
  ...quantityMatchLevels,
];
