import { HEBREW_LETTERS } from "@/lib/game-constants";

export var MATCH_PAIR_COUNT = 8;
export var MATCH_ROW_LAYOUT = [5, 6, 5];

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

export function pickMatchLetters(letterSet, pairCount) {
  var targetCount = pairCount || MATCH_PAIR_COUNT;
  var preferredLetters = [];
  var fallbackLetters = [];

  (letterSet || []).forEach(function(letter) {
    if (preferredLetters.indexOf(letter) === -1) {
      preferredLetters.push(letter);
    }
  });

  HEBREW_LETTERS.forEach(function(letter) {
    if (preferredLetters.indexOf(letter) === -1 && fallbackLetters.indexOf(letter) === -1) {
      fallbackLetters.push(letter);
    }
  });

  return shuffleArray(preferredLetters)
    .concat(shuffleArray(fallbackLetters))
    .slice(0, targetCount);
}

export function createMatchDeck(letterSet, pairCount) {
  var letters = pickMatchLetters(letterSet, pairCount || MATCH_PAIR_COUNT);
  var cards = [];

  letters.forEach(function(letter, index) {
    cards.push({ id: letter + "-a-" + index, letter: letter, revealed: false, matched: false });
    cards.push({ id: letter + "-b-" + index, letter: letter, revealed: false, matched: false });
  });

  return shuffleArray(cards);
}
