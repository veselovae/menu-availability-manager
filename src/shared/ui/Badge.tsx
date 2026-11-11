// Отображает статус в виде метки с общими стилями.
type BadgeVariant = "success" | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const VARIANTS_STYLES: Record<BadgeVariant, string> = {
  success: "badge-available",
  danger: "badge-stopped",
};

export function Badge({ children, variant = "success" }: BadgeProps) {
  const finalClassName = ["status-badge", VARIANTS_STYLES[variant]].join(" ");

  return <span className={finalClassName}>{children}</span>;
}
