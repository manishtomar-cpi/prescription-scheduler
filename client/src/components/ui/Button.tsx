import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  isLoading,
  children,
  className = "",
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      disabled={isLoading || rest.disabled}
      className={`inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 ${className}`}
    >
      {isLoading && (
        <span className="mr-2 h-3 w-3 inline-flex rounded-full border-2 border-white border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
};
