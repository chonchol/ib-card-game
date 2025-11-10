const SUIT_POINTS = {
    clubs: 6,
    diamonds: 7,
    hearts: 8,
    spades: 9,
    "no trump": 10,
};


function calculateScore(tricksWon, tricksRequired, level, trumpSuit) {
    const overtricks = Math.max(0, tricksWon - tricksRequired);
    const undertricks = Math.max(0, tricksRequired - tricksWon);

    if (undertricks > 0) {
        // Failed contract
        return -50 * undertricks;
    }

    // Made contract
    let score = 0;

    // Base score for making contract
    score += level * SUIT_POINTS[trumpSuit];

    // Overtrick bonus
    score += overtricks * SUIT_POINTS[trumpSuit];

    // Game bonus (100 points or more in tricks)
    if (level * SUIT_POINTS[trumpSuit] >= 100) {
        score += 300;
    }

    // Small slam bonus (level 6)
    if (level === 6) {
        score += 50;
    }

    // Grand slam bonus (level 7)
    if (level === 7) {
        score += 150;
    }

    return score;
}

export { calculateScore };

