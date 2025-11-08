const Button = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border border-slate-300 rounded-full px-2 py-1 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
