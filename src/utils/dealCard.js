function dealCard(deck) {
    const hands = [[], [], [], []];
    const shuffledDeck = [...deck];

    // Deal 13 cards to each player
    for (let i = 0; i < 52; i++) {
        const playerIndex = i % 4;  // 0, 1, 2, 3 repeatedly
        hands[playerIndex].push(shuffledDeck[i]);
    }

    return hands;
}

export default dealCard;