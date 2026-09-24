import {
  MenuItemStatusKind,
  Shop,
  StopReason,
  type MenuItem,
} from "@/types/menu";

const INITIAL_UPDATED_AT = "2026-09-24T08:00:00.000Z";

export const menuItemsMock: MenuItem[] = [
  // KITCHEN SECTION
  {
    id: "item-1",
    title: "Паста карбонара",
    shop: Shop.Kitchen,
    stock: 12,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-2",
    title: "Том ям",
    shop: Shop.Kitchen,
    stock: 4,
    status: {
      kind: MenuItemStatusKind.Stopped,
      reason: StopReason.Equipment,
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-3",
    title: "Стейк из лосося",
    shop: Shop.Kitchen,
    stock: 7,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-4",
    title: "Ризотто с грибами",
    shop: Shop.Kitchen,
    stock: 3,
    status: {
      kind: MenuItemStatusKind.Stopped,
      reason: StopReason.Quality,
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-5",
    title: "Цезарь с курицей",
    shop: Shop.Kitchen,
    stock: 18,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },

  // BAR SECTION
  {
    id: "item-6",
    title: "Лимонад маракуйя",
    shop: Shop.Bar,
    stock: 20,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-7",
    title: "Эспрессо-тоник",
    shop: Shop.Bar,
    stock: 9,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-8",
    title: "Матча-латте",
    shop: Shop.Bar,
    stock: 0,
    status: {
      kind: MenuItemStatusKind.Stopped,
      reason: StopReason.OutOfStock,
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-9",
    title: "Грейпфрутовый фреш",
    shop: Shop.Bar,
    stock: 5,
    status: {
      kind: MenuItemStatusKind.Stopped,
      reason: StopReason.MenuChange,
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-10",
    title: "Какао",
    shop: Shop.Bar,
    stock: 14,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },

  // PASTRY SECTION
  {
    id: "item-11",
    title: "Чизкейк Сан-Себастьян",
    shop: Shop.Pastry,
    stock: 6,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-12",
    title: "Медовик",
    shop: Shop.Pastry,
    stock: 8,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-13",
    title: "Павлова",
    shop: Shop.Pastry,
    stock: 2,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-14",
    title: "Шоколадный тарт",
    shop: Shop.Pastry,
    stock: 11,
    status: { kind: MenuItemStatusKind.Available },
    updatedAt: INITIAL_UPDATED_AT,
  },
];
