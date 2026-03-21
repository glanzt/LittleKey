export var MATCH_PAIR_COUNT = 8;
export var MATCH_ROW_LAYOUT = [5, 6, 5];
export var FEELING_ITEMS = [
  { id: "כועס", label: "כועס", imageSrc: "/feelings/%D7%9B%D7%95%D7%A2%D7%A1.png", audioName: "כועס" },
  { id: "עייף", label: "עייף", imageSrc: "/feelings/%D7%A2%D7%99%D7%99%D7%A3.png", audioName: "עייף" },
  { id: "עצוב", label: "עצוב", imageSrc: "/feelings/%D7%A2%D7%A6%D7%95%D7%91.png", audioName: "עצוב" },
  { id: "עירני", label: "עירני", imageSrc: "/feelings/%D7%A2%D7%99%D7%A8%D7%A0%D7%99.png", audioName: "עירוני" },
  { id: "מפחד", label: "מפחד", imageSrc: "/feelings/%D7%9E%D7%A4%D7%97%D7%93.png", audioName: "מפחד" },
  { id: "מופתע", label: "מופתע", imageSrc: "/feelings/%D7%9E%D7%95%D7%A4%D7%AA%D7%A2.png", audioName: "מופתע" },
  { id: "שמח", label: "שמח", imageSrc: "/feelings/%D7%A9%D7%9E%D7%97.png", audioName: "שמח" },
  { id: "נבוך", label: "נבוך", imageSrc: "/feelings/%D7%A0%D7%91%D7%95%D7%9A.png", audioName: "נבוך" },
  { id: "מחייך", label: "מחייך", imageSrc: "/feelings/%D7%9E%D7%97%D7%99%D7%99%D7%9A.png", audioName: "מחייך" },
  { id: "מתרגש", label: "מתרגש", imageSrc: "/feelings/%D7%9E%D7%AA%D7%A8%D7%92%D7%A9.png", audioName: "מתרגש" },
];

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

export function pickMatchItems(pairCount) {
  return shuffleArray(FEELING_ITEMS).slice(0, pairCount || MATCH_PAIR_COUNT);
}

export function createMatchDeck(pairCount) {
  var items = pickMatchItems(pairCount || MATCH_PAIR_COUNT);
  var cards = [];

  items.forEach(function(item, index) {
    cards.push({ id: item.id + "-a-" + index, matchKey: item.id, label: item.label, imageSrc: item.imageSrc, audioName: item.audioName, revealed: false, matched: false });
    cards.push({ id: item.id + "-b-" + index, matchKey: item.id, label: item.label, imageSrc: item.imageSrc, audioName: item.audioName, revealed: false, matched: false });
  });

  return shuffleArray(cards);
}
