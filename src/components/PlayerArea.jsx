import SingleCard from "./SingleCard";

const PlayerArea = ({
  playerIdx,
  position,
  hands,
  currentPlayer,
  players,
  setHands,
  setTrick,
  setCurrentPlayer,
  trick, // Add trick to props
}) => {
  function playCard(playerIndex, cardIndex, e) {
    // Must be a real user click
    if (!e?.nativeEvent?.isTrusted) return;

    // Must be this player's turn
    if (playerIndex !== currentPlayer) return;

    // Get the card to be played
    const cardToPlay = hands[playerIndex][cardIndex];
    if (!cardToPlay) return; // Card must exist

    // Enforce follow-suit: if the trick has a leading suit, and the player
    // has at least one card of that suit, they must play that suit.
    if (trick.length > 0) {
      const leadingSuit = trick[0].card?.suit;
      if (leadingSuit) {
        const playerHand = hands[playerIndex] || [];
        const hasLeadingSuit = playerHand.some((c) => c.suit === leadingSuit);
        if (hasLeadingSuit && cardToPlay.suit !== leadingSuit) {
          // Illegal play: player must follow suit
          console.log(
            `Player ${playerIndex} must follow suit ${leadingSuit} but tried to play ${cardToPlay.suit}`
          );
          return;
        }
      }
    }

    // For first play in a new trick, any player who won last trick can play
    const isFirstPlayInTrick = trick.length === 0;
    if (!isFirstPlayInTrick) {
      // After first play, sequence should follow from the first player
      const firstPlayerInTrick = trick[0].player; // Who played first in this trick
      // Calculate next player based on who played first
      const expectedPlayer = (firstPlayerInTrick + trick.length) % 4;
      if (playerIndex !== expectedPlayer) {
        console.log(
          `Expected player ${players[expectedPlayer].name} but got ${players[playerIndex].name}`
        );
        return;
      }
    }

    // Remove the card from hand
    setHands((prev) => {
      const next = prev.map((h) => h.slice());
      next[playerIndex].splice(cardIndex, 1);
      return next;
    });

    // Add the card to the trick
    setTrick((currentTrick) => [
      ...currentTrick,
      { player: playerIndex, card: cardToPlay },
    ]);

    // Move to next player
    setCurrentPlayer((p) => (p + 1) % 4);
  }

  const hand = hands[playerIdx] || [];
  const isActive = playerIdx === currentPlayer;
  //   const isYou = playerIdx === 0;
  return (
    <div
      className={`flex flex-col items-center ${
        isActive ? "ring-2 ring-emerald-400 rounded-lg p-1" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-300">
        <div className="rounded-full bg-slate-700/10 dark:bg-slate-600/40 px-3 py-1 text-sm font-medium shadow-sm">
          {players[playerIdx].name}
        </div>
        <div className="text-xs opacity-60">{hand.length} cards</div>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        {hand.map((c, i) => {
          const isFirstPlayInTrick = trick.length === 0;
          let expectedPlayer;

          if (isFirstPlayInTrick) {
            // If it's the first play, currentPlayer (last trick's winner) goes first
            expectedPlayer = currentPlayer;
          } else {
            // Otherwise, calculate next player based on who played first this trick
            const firstPlayerInTrick = trick[0].player;
            expectedPlayer = (firstPlayerInTrick + trick.length) % 4;
          }

          const isMyTurn =
            playerIdx === currentPlayer && playerIdx === expectedPlayer;
          // Determine if this specific card is playable.
          // If it's not the first play, and there's a leading suit, and
          // the player has cards of that suit, they may only play cards
          // of that suit. Otherwise any card is allowed when it's their turn.
          let isPlayable = isMyTurn;
          if (isPlayable && !isFirstPlayInTrick && trick[0]?.card) {
            const leadingSuit = trick[0].card.suit;
            if (leadingSuit) {
              const hasLeadingSuit = hand.some(
                (card) => card.suit === leadingSuit
              );
              if (hasLeadingSuit && c.suit !== leadingSuit) {
                isPlayable = false;
              }
            }
          }

          return (
            <SingleCard
              key={c.id}
              card={c}
              small={position !== "south"}
              onClick={
                isPlayable
                  ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      playCard(playerIdx, i, e);
                    }
                  : undefined
              }
              className={`transition-all duration-200 ${
                isPlayable
                  ? "cursor-pointer hover:scale-110"
                  : "cursor-not-allowed opacity-50"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlayerArea;
