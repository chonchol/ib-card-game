import Lobby from "./components/Lobby";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 transition-colors">
      <Lobby />
    </div>
  );
};

export default App;
