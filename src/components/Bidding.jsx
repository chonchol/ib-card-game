import { useMemo, useState } from "react";
import Button from "./ui/Button";

const SUITS = ["clubs", "diamonds", "hearts", "spades", "no trump"];

const Bidding = ({
  addPosition,
  biddingTurn,
  players = [],
  highestBid,
  bids = [],
  onBid,
  onPass,
  onClose,
}) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSuit, setSelectedSuit] = useState(null);

  const currentPlayerName =
    biddingTurn !== null ? players[biddingTurn]?.name : "-";

  const canBid = useMemo(() => biddingTurn !== null, [biddingTurn]);

  function handlePlaceBid() {
    if (!canBid) return;
    if (!selectedLevel || !selectedSuit) return;
    onBid && onBid(selectedLevel, selectedSuit);
    setSelectedLevel(null);
    setSelectedSuit(null);
  }

  function handlePass() {
    if (!canBid) return;
    onPass && onPass();
  }

  return (
    <div
      className={`bg-green-800/10 dark:bg-green-900/30 rounded-xl p-6 flex flex-col items-center w-full h-auto text-slate-600 dark:text-slate-300 ${addPosition}`}
    >
      <div className="mb-2 text-xs opacity-60">
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <Button
              key={n}
              onClick={() => setSelectedLevel(n)}
              className={selectedLevel === n ? "bg-blue-500 text-white" : ""}
            >
              {n}
            </Button>
          ))}
        </div>
        <div className="flex justify-between my-4">
          {SUITS.map((s) => (
            <Button
              key={s}
              onClick={() => setSelectedSuit(s)}
              className={selectedSuit === s ? "bg-blue-500 text-white" : ""}
            >
              {s.replace(/\b\w/g, (c) => c.toUpperCase())}
            </Button>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={handlePass}>Pass</Button>
          <Button
            onClick={() => {
              // Double is not implemented fully yet; placeholder
              console.log("Double clicked");
            }}
          >
            Double
          </Button>
          <div className="flex gap-4 place-items-center">
            <Button onClick={handlePlaceBid} className="col-span-3">
              Bid
            </Button>
            <Button onClick={onClose} className="col-span-3">
              Close
            </Button>
          </div>
        </div>

        <p className="mt-4 text-xs opacity-60">
          <strong>Selection:</strong> {selectedLevel ? selectedLevel : "-"}{" "}
          {selectedSuit ? selectedSuit : "-"}
        </p>

        <p className="mt-1 text-xs opacity-60">
          <strong>Current turn:</strong> {currentPlayerName}
        </p>

        <p className="mt-1 text-xs opacity-60">
          <strong>Highest bid:</strong>{" "}
          {highestBid ? `${highestBid.level} ${highestBid.suit}` : "-"}
        </p>

        <p className="mt-1 text-xs opacity-60">
          <strong>History:</strong>{" "}
          {bids && bids.length > 0
            ? bids
                .map((b) =>
                  b.pass
                    ? `P(${players[b.player]?.name})`
                    : `${b.level}${b.suit ? " " + b.suit : ""}`
                )
                .join(", ")
            : "-"}
        </p>
      </div>
    </div>
  );
};

export default Bidding;
