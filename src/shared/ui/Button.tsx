// Задает общие стили кнопок и состояние отправки с индикатором.
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

const VARIANTS_STYLES = {
  primary: "bg-[#C6462F] text-white hover:bg-[#B63D29]",
  secondary:
    "border border-neutral-300 bg-white text-[#171512] hover:bg-neutral-50",
  ghost: "text-[#171512] hover:bg-neutral-100",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const finalClassName = [
    `inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm 
    font-medium transition disabled:cursor-not-allowed disabled:opacity-50`,
    VARIANTS_STYLES[variant],
    className,
  ].join(" ");

  return (
    <button
      {...props}
      className={finalClassName}
      disabled={disabled || loading}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
