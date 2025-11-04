import { motion } from "framer-motion";

const SingleCard = ({ card, onClick, small }) => {
  console.log(card);
  const color =
    card?.suit === "hearts" || card?.suit === "diamonds"
      ? "text-red-500"
      : "text-black dark:text-white";
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`cursor-pointer select-none ${
        small ? "w-10 h-14" : "w-12 h-16"
      } flex flex-col items-center justify-center rounded-md border bg-white dark:bg-slate-700 shadow-sm ${color}`}
    >
      {card ? (
        <>
          <div className="font-semibold text-xs">{card.rank}</div>
          <div className="text-xl">{card.suitSymbol}</div>
        </>
      ) : (
        <div className="opacity-40 text-xs">Empty</div>
      )}
    </motion.div>
  );
};

export default SingleCard;
