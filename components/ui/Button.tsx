interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
const Button = ({ children, className = "", ...props }: Props) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-primary text-black
                  hover:bg-primary cursor-pointer transition-all duration-600 ease-in-out disabled:hover:cursor-not-allowed 
                  disabled:hover:bg-primary/40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
