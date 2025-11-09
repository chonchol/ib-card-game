export const SUITS = [
    { symbol: "♠", name: "spades" },
    { symbol: "♥", name: "hearts" },
    { symbol: "♦", name: "diamonds" },
    { symbol: "♣", name: "clubs" },
];
export const RANKS = [
    "A",
    "K",
    "Q",
    "J",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
];

function generateDeck() {
    // Use timestamp + counter to ensure unique IDs even across reshuffles
    const timestamp = Date.now();
    let id = 0;
    const deck = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({
                id: `${timestamp}_${id++}`,
                suit: suit.name,
                suitSymbol: suit.symbol,
                rank
            });
        }
    }
    return deck;
}
export default generateDeck;