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
  //   function playCard(playerIndex, cardIndex) {

  //     if (playerIndex !== currentPlayer) return;
  //     setHands((prev) => {
  //       const next = prev.map((h) => h.slice());
  //       const [played] = next[playerIndex].splice(cardIndex, 1);
  //       setTrick((t) => [...t, { player: playerIndex, card: played }]);
  //       setCurrentPlayer((p) => (p + 1) % 4);
  //       return next;
  //     });
  //   }

  function playCard(playerIndex, cardIndex, e) {
    // Must be a real user click
    if (!e?.nativeEvent?.isTrusted) return;

    // Must be this player's turn
    if (playerIndex !== currentPlayer) return;

    // Get the card to be played
    const cardToPlay = hands[playerIndex][cardIndex];
    if (!cardToPlay) return; // Card must exist

    // For first play in a new trick, any player who won last trick can play
    const isFirstPlayInTrick = trick.length === 0;
    if (!isFirstPlayInTrick) {
      // After first play, must follow correct sequence
      const expectedPlayer = trick.length % 4;
      if (playerIndex !== expectedPlayer) {
        console.log("Not your turn in the sequence");
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
      <div className="flex items-center gap-2 mb-2">
        <div className="rounded-full bg-slate-700/10 dark:bg-slate-600/40 px-3 py-1 text-sm font-medium shadow-sm">
          {players[playerIdx].name}
        </div>
        <div className="text-xs opacity-60">{hand.length} cards</div>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        {hand.map((c, i) => {
          const isFirstPlayInTrick = trick.length === 0;
          const expectedPlayer = isFirstPlayInTrick
            ? currentPlayer
            : trick.length % 4;
          const isMyTurn =
            playerIdx === currentPlayer &&
            (isFirstPlayInTrick || playerIdx === expectedPlayer);
          const isPlayable = isMyTurn;

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
