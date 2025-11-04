const Bidding = () => {
  return (
    <div className="bg-green-800/10 dark:bg-green-900/30 rounded-xl p-6 w-1/2 flex flex-col items-center h-44 text-slate-600 dark:text-slate-300">
      <div className="w-full mb-2 text-xs opacity-60">
        <p className="mt-4 text-xs opacity-60">
          <strong>Note:-</strong> P: Play Point, H: Honour Bonus, S: Short Suit
          Bonus, R: Rubber Bonus, G: Game, LS: Little Slam, GS: Grand Slam,
          FC/OTFC: Bonus for Double
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 place-items-center"></div>
    </div>
  );
};

export default Bidding;
