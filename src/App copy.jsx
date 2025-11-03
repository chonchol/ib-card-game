import { AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Card from "./components/SingleCard";

// ===================== Helper Functions =====================
const SUITS = [
  { symbol: "♠", name: "spades" },
  { symbol: "♥", name: "hearts" },
  { symbol: "♦", name: "diamonds" },
  { symbol: "♣", name: "clubs" },
];
const RANKS = [
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
  let id = 0;
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: id++, suit: suit.name, suitSymbol: suit.symbol, rank });
    }
  }
  return deck;
}
function shuffle(deck) {
  const array = [...deck];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function deal(deck) {
  const hands = [[], [], [], []];
  deck.forEach((card, i) => {
    hands[i % 4].push(card);
  });
  return hands;
}

// ===================== Context =====================
const TableContext = createContext();
export const useTable = () => useContext(TableContext);

<Card />;

// ===================== Bridge Table Component =====================
export default function BridgeTable({ tableId }) {
  const [deck, setDeck] = useState(() => shuffle(generateDeck()));
  const [hands, setHands] = useState(() => deal(deck));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [trick, setTrick] = useState([]);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const players = useMemo(
    () => [
      { id: 0, name: "South" },
      { id: 1, name: "West" },
      { id: 2, name: "North" },
      { id: 3, name: "East" },
    ],
    []
  );

  function reshuffle() {
    const d = shuffle(generateDeck());
    setDeck(d);
    setHands(deal(d));
    setTrick([]);
    setHistory([]);
    setCurrentPlayer(0);
  }

  function playCard(playerIndex, cardIndex) {
    if (playerIndex !== currentPlayer) return;
    setHands((prev) => {
      const next = prev.map((h) => h.slice());
      const [played] = next[playerIndex].splice(cardIndex, 1);
      setTrick((t) => [...t, { player: playerIndex, card: played }]);
      setCurrentPlayer((p) => (p + 1) % 4);
      return next;
    });
  }

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

  function renderPlayerArea(playerIdx, position) {
    const hand = hands[playerIdx] || [];
    const isActive = playerIdx === currentPlayer;
    const isYou = playerIdx === 0;
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
          {hand.map((c, i) => (
            <Card
              key={c.id}
              card={isYou ? c : null}
              small={position !== "south"}
              onClick={() => playCard(playerIdx, i)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 transition-colors">
      <div className="max-w-7xl w-full">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Table: {tableId}
          </h1>
          <div className="flex items-center gap-2">
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
              <span className="text-sm">{darkMode ? "Light" : "Dark"}</span>
            </button>
          </div>
        </header>
        <main className="bg-white/80 dark:bg-slate-800/70 rounded-2xl p-6 shadow-lg grid grid-rows-[auto,1fr,auto] gap-6">
          <div className="flex items-center justify-center">
            {renderPlayerArea(2, "north")}
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="w-1/4 flex items-center justify-center">
              {renderPlayerArea(1, "west")}
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
              <div className="relative bg-green-800/10 dark:bg-green-900/30 rounded-xl p-6 w-full flex flex-col items-center">
                <div className="mb-2 text-xs opacity-60">Table</div>
                <div className="grid grid-cols-3 gap-4 place-items-center">
                  <AnimatePresence>
                    {trick.map((t) => (
                      <Card key={t.card.id} card={t.card} small />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="w-1/4 flex items-center justify-center">
              {renderPlayerArea(3, "east")}
            </div>
          </div>
          <div className="flex items-center justify-center">
            {renderPlayerArea(0, "south")}
          </div>
        </main>
      </div>
    </div>
  );
}

// ===================== Lobby Component for Multiple Tables =====================
export function Lobby() {
  const [tables, setTables] = useState([{ id: "1" }, { id: "2" }]);
  const [currentTable, setCurrentTable] = useState(null);

  if (currentTable) return <BridgeTable tableId={currentTable.id} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Bridge Lobby</h1>
      <div className="flex gap-4">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => setCurrentTable(t)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Join Table {t.id}
          </button>
        ))}
      </div>
      <button
        onClick={() =>
          setTables([...tables, { id: (tables.length + 1).toString() }])
        }
        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
      >
        Create New Table
      </button>
    </div>
  );
}
