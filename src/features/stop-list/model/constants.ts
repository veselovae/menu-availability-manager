// Содержит подписи цехов и причин стопа для отображения в интерфейсе.
import { Shop, StopReason } from "@/types/menu";

export const SHOP_LABELS: Record<Shop, string> = {
  [Shop.Kitchen]: "Кухня",
  [Shop.Bar]: "Бар",
  [Shop.Pastry]: "Кондитерская",
};

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  [StopReason.OutOfStock]: "Закончились продукты",
  [StopReason.Equipment]: "Сломалось оборудование",
  [StopReason.Quality]: "Вопросы к качеству партии",
  [StopReason.MenuChange]: "Позиция выведена из меню смены",
};
