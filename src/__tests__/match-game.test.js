const { MATCH_PAIR_COUNT, FEELING_ITEMS, createMatchDeck, pickMatchItems } = require("@/lib/match-game");

describe("match game helpers", () => {
  it("creates a deck with 16 cards and 8 matching pairs", () => {
    const deck = createMatchDeck(MATCH_PAIR_COUNT);
    const counts = deck.reduce((acc, card) => {
      acc[card.matchKey] = (acc[card.matchKey] || 0) + 1;
      return acc;
    }, {});

    expect(deck).toHaveLength(16);
    expect(Object.keys(counts)).toHaveLength(8);
    Object.values(counts).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it("picks unique feeling images for each round", () => {
    const items = pickMatchItems(MATCH_PAIR_COUNT);
    const ids = items.map((item) => item.id);

    expect(items).toHaveLength(8);
    expect(new Set(ids).size).toBe(8);
    items.forEach((item) => {
      expect(FEELING_ITEMS).toEqual(expect.arrayContaining([expect.objectContaining({ id: item.id })]));
      expect(item.imageSrc).toMatch(/^\/api\/feelings\?type=image&name=/);
    });
  });
});
