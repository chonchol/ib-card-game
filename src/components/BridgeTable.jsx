import { AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PlayerArea from "../components/PlayerArea";
import SingleCard from "../components/SingleCard";
import dealCard from "../utils/dealCard";
import generateDeck, { RANKS } from "../utils/generateDeck";
import shuffleCard from "../utils/shuffleCard";

const BridgeTable = ({ table }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [trick, setTrick] = useState([]);
  const [deck, setDeck] = useState(() => shuffleCard(generateDeck()));
  const [hands, setHands] = useState(() => dealCard(deck));
  const [currentPlayer, setCurrentPlayer] = useState(0);

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
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    if (trick.length === 4) {
      const leadSuit = trick[0].card.suit;
      const rankIndex = (r) => RANKS.indexOf(r);
      let best = { idx: 0, rank: -1 };
      trick.forEach((t, i) => {
        if (t.card.suit === leadSuit) {
          const ri = rankIndex(t.card.rank);
          if (ri < best.rank || best.rank === -1) best = { idx: i, rank: ri };
        }
      });
      const winner = trick[best.idx].player;
      setTimeout(() => {
        setHistory((h) => [...h, { winner, trick: trick.slice() }]);
        setTrick([]);
        setCurrentPlayer(winner);
      }, 800);
    }
  }, [trick]);

  function reshuffle() {
    const d = shuffleCard(generateDeck());
    setDeck(d);
    setHands(dealCard(d));
    setTrick([]);
    setHistory([]);
    setCurrentPlayer(0);
  }

  console.log({ hands, trick, history });

  return (
    // <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 transition-colors">
    <div className="max-w-7xl w-full">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Table: {table}
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium shadow hover:bg-blue-600">
            Result
          </button>
          <button className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium shadow hover:bg-blue-600">
            Bid
          </button>
          <button
            onClick={reshuffle}
            className="px-3 py-2 rounded-lg bg-emerald-500 text-white font-medium shadow hover:bg-emerald-600"
          >
            Reshuffle & Deal
          </button>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border shadow"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm">{darkMode ? "Dark" : "Light"}</span>
          </button>
        </div>
      </header>
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
              <div className="text-sm">
                Tricks won:{" "}
                <span className="font-semibold">{history.length}</span>
              </div>
            </div>
            <div className="relative bg-green-800/10 dark:bg-green-900/30 rounded-xl p-6 w-full flex flex-col items-center h-44">
              <div className="mb-2 text-xs opacity-60 text-slate-600 dark:text-slate-300">
                Table
              </div>
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
          />
        </div>
      </main>
    </div>
    // </div>
  );
};

export default BridgeTable;
