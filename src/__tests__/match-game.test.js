const { MATCH_PAIR_COUNT, createMatchDeck, pickMatchLetters } = require("@/lib/match-game");

describe("match game helpers", () => {
  it("creates a deck with 16 cards and 8 matching pairs", () => {
    const deck = createMatchDeck(["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"], MATCH_PAIR_COUNT);
    const counts = deck.reduce((acc, card) => {
      acc[card.letter] = (acc[card.letter] || 0) + 1;
      return acc;
    }, {});

    expect(deck).toHaveLength(16);
    expect(Object.keys(counts)).toHaveLength(8);
    Object.values(counts).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it("falls back to additional Hebrew letters when the selected set is too small", () => {
    const letters = pickMatchLetters(["א", "ב", "ג"], MATCH_PAIR_COUNT);

    expect(letters).toHaveLength(8);
    expect(new Set(letters).size).toBe(8);
    expect(letters).toEqual(expect.arrayContaining(["א", "ב", "ג"]));
  });
});
