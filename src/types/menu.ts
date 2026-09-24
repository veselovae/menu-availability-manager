/*
Вместо строковых объединений из ТЗ, решила использовать enum
как единый источник истины: изменение значения в одном месте 
не потребует правок во всех местах его использования
*/

export enum Shop {
  Kitchen = "kitchen",
  Bar = "bar",
  Pastry = "pastry",
}

export enum StopReason {
  OutOfStock = "out_of_stock", // закончились продукты
  Equipment = "equipment", // сломалось оборудование
  Quality = "quality", // вопросы к качеству партии
  MenuChange = "menu_change", // позиция выведена из меню смены
}

export enum MenuItemStatusKind {
  Available = "available",
  Stopped = "stopped",
}

export type MenuItemStatus =
  | { kind: MenuItemStatusKind.Available }
  | {
      kind: MenuItemStatusKind.Stopped;
      reason: StopReason;
      until: string | null; // ISO-время или null = до конца смены
    };

export interface MenuItem {
  id: string;
  title: string;
  shop: Shop;
  stock: number; // остаток в штуках, 0..99
  status: MenuItemStatus;
  updatedAt: string; // ISO
}

export interface StopItemPayload {
  reason: StopReason;
  until: string | null;
}
