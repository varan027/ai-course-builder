import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const TopicInput = ({ className = "", ...props }: Props) => {
  return (
    <input
      className={`w-full px-3 py-2 rounded-md text-sm
                  focus:outline-none bg-uibgclr ${className}`}
      {...props}
    />
  );
}

export default TopicInput;