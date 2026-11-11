// Задает общие стили кнопок и состояние отправки с индикатором.
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

const VARIANTS_STYLES = {
  primary: "button-primary",
  secondary: "button-secondary",
  ghost: "button-ghost",
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
    "app-button",
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
