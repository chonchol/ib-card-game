const Result = ({ addPosition, roundResults }) => {
  return (
    <div
      className={`bg-green-800/10 dark:bg-green-900/30 rounded-xl p-6 flex flex-col items-center h-44 text-slate-600 dark:text-slate-300 ${addPosition}`}
    >
      <div className="w-full mb-2 text-xs opacity-60">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th>Board No</th>
              <th>Trump</th>
              <th>We</th>
              <th>They</th>
            </tr>
          </thead>
          <tbody>
            {roundResults?.map((result) => (
              <tr key={result.roundNumber}>
                <td>{result.roundNumber}</td>
                <td>
                  {result.declarer} - {result.contract}
                </td>
                <td>{result.tricksWon}</td>
                <td>{result.score}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="font-bold border-t-2 border-emerald-400 dark:border-emerald-800 mt-2">
            <tr>
              <td></td>
              <td>Total</td>
              <td>
                {roundResults?.reduce((sum, r) => sum + r.tricksWon, 0) || 0}
              </td>
              <td>{roundResults?.reduce((sum, r) => sum + r.score, 0) || 0}</td>
            </tr>
          </tfoot>
        </table>
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

export default Result;
