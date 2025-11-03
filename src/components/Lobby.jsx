import { useState } from "react";
import BridgeTable from "./BridgeTable";

const Lobby = () => {
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
};

export default Lobby;
