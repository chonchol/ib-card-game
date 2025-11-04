const Button = ({ children }) => {
  return (
    <button className="border border-slate-300 rounded-full px-2 py-1 cursor-pointer">
      {children}
    </button>
  );
};

export default Button;
