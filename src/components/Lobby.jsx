import { useState } from "react";
import BridgeTable from "./BridgeTable";

const Lobby = () => {
  const [tables, setTables] = useState([
    { id: "1", table: "London" },
    { id: "2", table: "Paris" },
  ]);
  const [currentTable, setCurrentTable] = useState(null);

  if (currentTable) return <BridgeTable table={currentTable.table} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold text-slate-600 dark:text-slate-300">
        Bridge Lobby - Join a Table
      </h1>
      <div className="flex gap-4">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => setCurrentTable(t)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            {t.table}
          </button>
        ))}
      </div>
      <button
        onClick={() =>
          setTables([
            ...tables,
            {
              id: (tables.length + 1).toString(),
              table: `Table ${tables.length + 1}`,
            },
          ])
        }
        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
      >
        Create New Table
      </button>
    </div>
  );
};

export default Lobby;
