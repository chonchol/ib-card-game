import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PlayerArea from "../components/PlayerArea";
import Result from "../components/Result";
import SingleCard from "../components/SingleCard";
import { calculateScore } from "../utils/calculateScore";
import dealCard from "../utils/dealCard";
import generateDeck, { RANKS } from "../utils/generateDeck";
import shuffleCard from "../utils/shuffleCard";
import Bidding from "./Bidding";
import BridgeTableHeader from "./BridgeTableHeader";

const BridgeTable = ({ table }) => {
  const [history, setHistory] = useState([]);
  const [trick, setTrick] = useState([]);
  const [deck, setDeck] = useState(() => shuffleCard(generateDeck()));
  const [hands, setHands] = useState(() => dealCard(deck));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isPlayPhase, setIsPlayPhase] = useState(false); // false means bidding phase
  const [showResultCard, setShowResultCard] = useState(false);
  const [showBiddingCard, setShowBiddingCard] = useState(false);
  const [roundResults, setRoundResults] = useState([]); // Store results of each round
  // Bidding state
  const [bids, setBids] = useState([]); // history of bids (including passes)
  const [biddingTurn, setBiddingTurn] = useState(null);
  const [highestBid, setHighestBid] = useState(null); // { player, level, suit, suitRank }
  const [passesInRow, setPassesInRow] = useState(0);
  const [trump, setTrump] = useState(null);
  const [contractLevel, setContractLevel] = useState(null);

  const SUIT_RANK = {
    clubs: 1,
    diamonds: 2,
    hearts: 3,
    spades: 4,
    "no trump": 5,
  };

  const players = useMemo(
    () => [
      { id: 0, name: "South" },
      { id: 1, name: "West" },
      { id: 2, name: "North" },
      { id: 3, name: "East" },
    ],
    []
  );

  useEffect(() => {
    if (!isPlayPhase || trick.length !== 4) return;

    const leadSuit = trick[0].card.suit;
    const rankIndex = (r) => RANKS.indexOf(r);

    // If trump is set and any trump card was played, the highest trump wins
    let winner;
    if (trump) {
      const trumpsPlayed = trick
        .map((t, i) => ({ ...t, idx: i }))
        .filter((t) => t.card.suit === trump);
      if (trumpsPlayed.length > 0) {
        let best = {
          idx: trumpsPlayed[0].idx,
          rank: rankIndex(trumpsPlayed[0].card.rank),
        };
        trumpsPlayed.forEach((t) => {
          const ri = rankIndex(t.card.rank);
          if (ri < best.rank) best = { idx: t.idx, rank: ri };
        });
        winner = trick[best.idx].player;
      }
    }

    // Otherwise highest of the lead suit wins
    if (!winner) {
      let best = { idx: 0, rank: -1 };
      trick.forEach((t, i) => {
        if (t.card.suit === leadSuit) {
          const ri = rankIndex(t.card.rank);
          if (ri < best.rank || best.rank === -1) best = { idx: i, rank: ri };
        }
      });
      winner = trick[best.idx].player;
    }

    setTimeout(() => {
      setHistory((h) => [...h, { winner, trick: trick.slice() }]);
      setTrick([]);
      setCurrentPlayer(winner);

      // Check if round is complete (13 tricks played)
      if (history.length === 12) {
        // We're adding the 13th trick
        const tricksWonByDeclarer =
          history.filter(
            (h) =>
              h.winner === highestBid.player ||
              h.winner === (highestBid.player + 2) % 4
          ).length +
          (winner === highestBid.player ||
          winner === (highestBid.player + 2) % 4
            ? 1
            : 0);

        // Calculate score
        const tricksRequired = 6 + contractLevel;
        // eslint-disable-next-line no-unused-vars
        const overtricks = Math.max(0, tricksWonByDeclarer - tricksRequired);
        // eslint-disable-next-line no-unused-vars
        const undertricks = Math.max(0, tricksRequired - tricksWonByDeclarer);

        const score = {
          roundNumber,
          declarer: players[highestBid.player].name,
          contract: `${contractLevel} ${trump.replace(/\b\w/g, (c) =>
            c.toUpperCase()
          )}`,
          tricksWon: tricksWonByDeclarer,
          score: calculateScore(
            tricksWonByDeclarer,
            tricksRequired,
            contractLevel,
            trump
          ),
        };

        setRoundResults((prev) => [...prev, score]);

        setTimeout(() => {
          if (roundNumber < 9) {
            // Start new round
            setRoundNumber((r) => r + 1);
            const newDeck = shuffleCard(generateDeck());
            setDeck(newDeck);
            setHands(dealCard(newDeck));
            setHistory([]);
            setTrick([]);
            setCurrentPlayer(roundNumber % 4); // Rotate dealer
            setIsPlayPhase(false); // Go back to bidding phase
            setShowBiddingCard(true); // Show bidding UI
            setBids([]);
            setHighestBid(null);
            setPassesInRow(0);
            setBiddingTurn(roundNumber % 4);
            setTrump(null);
            setContractLevel(null);
          } else {
            // Game complete after 9 rounds
            setShowResultCard(true);
          }
        }, 1500);
      }
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trick, trump, history.length, roundNumber, isPlayPhase]);

  function reshuffle() {
    const d = shuffleCard(generateDeck());
    setDeck(d);
    setHands(dealCard(d));
    setTrick([]);
    setHistory([]);
    setCurrentPlayer(0);
  }

  function handleResultCard() {
    setShowResultCard((prev) => !prev);
  }

  function startBidding() {
    // open bidding UI and initialize bidding state
    setShowBiddingCard(true);
    setBids([]);
    setHighestBid(null);
    setPassesInRow(0);
    setBiddingTurn(currentPlayer); // start bidding from current player (dealer)
    setTrump(null);
    setContractLevel(null);
  }

  function closeBidding() {
    setShowBiddingCard(false);
    setBiddingTurn(null);
    setIsPlayPhase(true); // Now cards can be played
  }

  function advanceBiddingTurn() {
    setBiddingTurn((t) => (t === null ? 0 : (t + 1) % 4));
  }

  function placeBid(level, suit) {
    if (biddingTurn === null) return;

    const suitKey = suit.toLowerCase();
    const bid = {
      player: biddingTurn,
      level,
      suit: suitKey,
      suitRank: SUIT_RANK[suitKey],
    };

    // Validate bid against highest bid
    if (highestBid) {
      // If level is less than highest bid's level, reject
      if (level < highestBid.level) {
        console.log("Bid level must be higher than current highest bid");
        return;
      }

      // If level is equal to highest bid's level, suit rank must be higher
      if (level === highestBid.level && bid.suitRank <= highestBid.suitRank) {
        console.log("When bidding at same level, suit rank must be higher");
        return;
      }
    }

    // Valid bid - record it
    setBids((prev) => [...prev, bid]);
    setHighestBid(bid);
    setPassesInRow(0);

    // Advance to next player
    advanceBiddingTurn();
  }

  function passBid() {
    if (biddingTurn === null) return;
    setBids((prev) => [...prev, { player: biddingTurn, pass: true }]);
    setPassesInRow((p) => p + 1);

    // Check end conditions after this pass
    const nextPasses = passesInRow + 1;

    // If no one has bid and everyone passes (4 passes) -> bidding ends with no contract
    if (!highestBid && nextPasses >= 4) {
      // all passed
      closeBidding();
      return;
    }

    // If there is a highest bid and three consecutive passes after it -> bidding ends
    if (highestBid && nextPasses >= 3) {
      // bidding won by highestBid.player
      setTrump(highestBid.suit);
      setContractLevel(highestBid.level);
      // Set the first player to be the one to the left of the bid winner
      setCurrentPlayer((highestBid.player + 1) % 4); // Next player after bid winner starts first trick
      // close bidding UI
      closeBidding();
      return;
    }

    advanceBiddingTurn();
  }

  console.log({ hands, trick, history });

  return (
    <div className="max-w-7xl w-full">
      <BridgeTableHeader
        table={table}
        handleResultCard={handleResultCard}
        startBidding={startBidding}
        reshuffle={reshuffle}
      />

      <main className="bg-white/80 dark:bg-slate-800/70 rounded-2xl p-6 shadow-lg grid grid-rows-[auto,1fr,auto] gap-6">
        <div className="flex items-center justify-center">
          <PlayerArea
            playerIdx={2}
            position="north"
            hands={hands}
            currentPlayer={currentPlayer}
            players={players}
            setHands={setHands}
            setTrick={setTrick}
            setCurrentPlayer={setCurrentPlayer}
            trick={trick}
            isPlayPhase={isPlayPhase}
          />
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="w-1/4 flex items-center justify-center">
            <PlayerArea
              playerIdx={1}
              position="west"
              hands={hands}
              currentPlayer={currentPlayer}
              players={players}
              setHands={setHands}
              setTrick={setTrick}
              setCurrentPlayer={setCurrentPlayer}
              trick={trick}
              isPlayPhase={isPlayPhase}
            />
          </div>
          <div className="flex flex-col items-center gap-4 w-2/4">
            <div className="w-full flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="text-sm">
                Current turn:{" "}
                <span className="font-semibold">
                  {players[currentPlayer].name}
                </span>
              </div>
              {contractLevel && trump && highestBid && (
                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>Contract:</strong> {contractLevel}{" "}
                  {trump.replace(/\b\w/g, (c) => c.toUpperCase())} —{" "}
                  <strong>Declarer:</strong>{" "}
                  {players[highestBid.player]?.name ?? "-"}
                </div>
              )}
              <div className="text-sm">
                Tricks won:{" "}
                <span className="font-semibold">{history.length}</span>
              </div>
            </div>
            <div className="relative bg-green-800/10 dark:bg-green-900/30 rounded-xl p-6 w-full flex flex-col items-center h-44">
              <div className="mb-2 text-xs opacity-60 text-slate-600 dark:text-slate-300">
                Table
              </div>
              {showResultCard && (
                <Result
                  addPosition="absolute top-0"
                  roundResults={roundResults}
                />
              )}

              <div className="grid grid-cols-3 gap-4 place-items-center">
                <AnimatePresence>
                  {trick.map((t) => (
                    <SingleCard key={t.card.id} card={t.card} small />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <PlayerArea
              playerIdx={3}
              position="east"
              hands={hands}
              currentPlayer={currentPlayer}
              players={players}
              setHands={setHands}
              setTrick={setTrick}
              setCurrentPlayer={setCurrentPlayer}
              trick={trick}
              isPlayPhase={isPlayPhase}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <PlayerArea
            playerIdx={0}
            position="south"
            hands={hands}
            currentPlayer={currentPlayer}
            players={players}
            setHands={setHands}
            setTrick={setTrick}
            setCurrentPlayer={setCurrentPlayer}
            trick={trick}
            isPlayPhase={isPlayPhase}
          />
        </div>
      </main>

      {showBiddingCard && (
        <Bidding
          //   addPosition="absolute top-0"
          biddingTurn={biddingTurn}
          players={players}
          highestBid={highestBid}
          bids={bids}
          onBid={(level, suit) => placeBid(level, suit)}
          onPass={() => passBid()}
          onClose={() => closeBidding()}
        />
      )}
    </div>
  );
};

export default BridgeTable;
