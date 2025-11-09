import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const BridgeTableHeader = ({
  table,
  handleResultCard,
  startBidding,
  reshuffle,
}) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Table: {table}
      </h1>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium shadow hover:bg-blue-600"
          onClick={() => handleResultCard()}
        >
          Result
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium shadow hover:bg-blue-600"
          onClick={() => startBidding()}
        >
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
  );
};

export default BridgeTableHeader;
