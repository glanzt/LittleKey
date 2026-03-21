import { DEFAULT_FEELING_ITEMS, pickRandomFeelings, shuffleArray } from "@/lib/feelings";

export var MATCH_PAIR_COUNT = 8;
export var MATCH_ROW_LAYOUT = [5, 6, 5];
export var FEELING_ITEMS = DEFAULT_FEELING_ITEMS;

export function pickMatchItems(pairCount, feelingItems) {
  return pickRandomFeelings(feelingItems || FEELING_ITEMS, pairCount || MATCH_PAIR_COUNT);
}

export function createMatchDeck(pairCount, feelingItems) {
  var items = pickMatchItems(pairCount || MATCH_PAIR_COUNT, feelingItems);
  var cards = [];

  items.forEach(function(item, index) {
    cards.push({ id: item.id + "-a-" + index, matchKey: item.id, label: item.label, imageSrc: item.imageSrc, audioName: item.audioName, revealed: false, matched: false });
    cards.push({ id: item.id + "-b-" + index, matchKey: item.id, label: item.label, imageSrc: item.imageSrc, audioName: item.audioName, revealed: false, matched: false });
  });

  return shuffleArray(cards);
}
