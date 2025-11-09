import { RANKS } from "./generateDeck";

const SUITS = [
    { symbol: "♠", name: "spades" },
    { symbol: "♥", name: "hearts" },
    { symbol: "♦", name: "clubs" },
    { symbol: "♣", name: "diamonds" },
];

function sortCards(cards) {
    return cards.sort((a, b) => {
        // Compare suit (higher suit first)
        const suitDiff = SUITS.findIndex(s => s.name === a.suit) - SUITS.findIndex(s => s.name === b.suit);
        if (suitDiff !== 0) return suitDiff;

        // If same suit, compare rank (higher rank first)
        const rankDiff = RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
        return rankDiff;
    });
}

export default sortCards;
