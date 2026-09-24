import { menuItemsMock } from "@/mocks/menu-items";
import {
  MenuItemStatusKind,
  type MenuItem,
  type StopItemPayload,
} from "@/types/menu";

let menuItems: MenuItem[] = structuredClone(menuItemsMock);

// Получаем список всех позиций меню
export const getMenuItems = (): MenuItem[] => menuItems;

// Получаем конкретную позицию по id
export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

// Ставим позицию в стоп или обновляем причину и срок существующего стопа по id
export function stopMenuItem(
  id: string,
  payload: StopItemPayload,
): MenuItem | undefined {
  // Сохраняем обновлённую позицию, чтобы вернуть её после обхода массива.
  // Если позиция не найдена, вернём undefined.
  let updatedItem: MenuItem | undefined;

  //   Обновляем массив с новым статусом элемента
  menuItems = menuItems.map((item) => {
    // Если это не та позиция, которую хотим изменить,
    // то возвращаем ее как есть
    if (item.id !== id) return item;

    // И обновляем нужную
    updatedItem = {
      ...item,
      status: {
        kind: MenuItemStatusKind.Stopped,
        reason: payload.reason,
        until: payload.until,
      },
      updatedAt: new Date().toISOString(),
    };
    return updatedItem;
  });

  // Возвращаем обновлённую позицию
  return updatedItem;
}

// Возвращаем в продажу конкретную позицию
export function resumeMenuItem(id: string): MenuItem | undefined {
  // Сохраняем обновлённую позицию для возврата из функции по аналогии с stopMenuItem
  let updatedItem: MenuItem | undefined;

  menuItems = menuItems.map((item) => {
    if (item.id !== id) {
      return item;
    }

    updatedItem = {
      ...item,
      status: {
        kind: MenuItemStatusKind.Available,
      },
      updatedAt: new Date().toISOString(),
    };

    return updatedItem;
  });

  return updatedItem;
}
