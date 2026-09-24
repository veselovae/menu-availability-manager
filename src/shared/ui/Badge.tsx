// Отображает статус в виде метки с общими стилями.
type BadgeVariant = "success" | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const VARIANTS_STYLES: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
};

export function Badge({ children, variant = "success" }: BadgeProps) {
  const finalClassName = [
    "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
    VARIANTS_STYLES[variant],
  ].join(" ");

  return <span className={finalClassName}>{children}</span>;
}
