import { Shop, MenuItemStatusKind } from "@/types/menu";

export const SHOPS: readonly Shop[] = Object.values(Shop);

export const MENU_ITEM_STATUSES: readonly MenuItemStatusKind[] =
  Object.values(MenuItemStatusKind);
