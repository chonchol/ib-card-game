import Button from "./ui/Button";

const Bidding = ({ addPosition }) => {
  return (
    <div
      className={`bg-green-800/10 dark:bg-green-900/30 rounded-xl p-6 flex flex-col items-center h-44 text-slate-600 dark:text-slate-300 ${addPosition}`}
    >
      <div className="w-full mb-2 text-xs opacity-60">
        <div className="flex justify-between">
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
          <Button>5</Button>
          <Button>6</Button>
          <Button>7</Button>
        </div>
        <div className="flex justify-between my-4">
          <Button>Clubs</Button>
          <Button>Diamonds</Button>
          <Button>Hearts</Button>
          <Button>Spades</Button>
          <Button>No Trump</Button>
        </div>
        <div className="flex justify-between">
          <Button>Pass</Button>
          <Button>Double</Button>
        </div>

        <p className="mt-4 text-xs opacity-60">
          <strong>Selection:-</strong>
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 place-items-center"></div>
    </div>
  );
};

export default Bidding;
