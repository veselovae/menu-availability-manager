import type { MenuItem } from "@/types/menu";

const INITIAL_UPDATED_AT = "2026-09-24T08:00:00.000Z";

export const menuItemsMock: MenuItem[] = [
  // KITCHEN SECTION
  {
    id: "item-1",
    title: "Паста карбонара",
    shop: "kitchen",
    stock: 12,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-2",
    title: "Том ям",
    shop: "kitchen",
    stock: 4,
    status: {
      kind: "stopped",
      reason: "equipment",
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-3",
    title: "Стейк из лосося",
    shop: "kitchen",
    stock: 7,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-4",
    title: "Ризотто с грибами",
    shop: "kitchen",
    stock: 3,
    status: {
      kind: "stopped",
      reason: "quality",
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-5",
    title: "Цезарь с курицей",
    shop: "kitchen",
    stock: 18,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },

  // BAR SECTION
  {
    id: "item-6",
    title: "Лимонад маракуйя",
    shop: "bar",
    stock: 20,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-7",
    title: "Эспрессо-тоник",
    shop: "bar",
    stock: 9,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-8",
    title: "Матча-латте",
    shop: "bar",
    stock: 0,
    status: {
      kind: "stopped",
      reason: "out_of_stock",
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-9",
    title: "Грейпфрутовый фреш",
    shop: "bar",
    stock: 5,
    status: {
      kind: "stopped",
      reason: "menu_change",
      until: null,
    },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-10",
    title: "Какао",
    shop: "bar",
    stock: 14,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },

  // PASTRY SECTION
  {
    id: "item-11",
    title: "Чизкейк Сан-Себастьян",
    shop: "pastry",
    stock: 6,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-12",
    title: "Медовик",
    shop: "pastry",
    stock: 8,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-13",
    title: "Павлова",
    shop: "pastry",
    stock: 2,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
  {
    id: "item-14",
    title: "Шоколадный тарт",
    shop: "pastry",
    stock: 11,
    status: { kind: "available" },
    updatedAt: INITIAL_UPDATED_AT,
  },
];
