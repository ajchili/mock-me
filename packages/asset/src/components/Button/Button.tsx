import { type ReactNode } from "react";

interface ButtonProps {
  children?: string | ReactNode;
  onClick?: () => void;
}

export const Button = ({ children, onClick }: ButtonProps): JSX.Element => {
  return (
    <button
      className="border-spacing-1 border-2 p-2 rounded-full border-slate-50 hover:border-slate-300 text-slate-950 bg-slate-50 hover:bg-slate-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
