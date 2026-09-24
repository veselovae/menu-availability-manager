import { parseApiError } from "@/shared/lib/api-error";
import type { MenuFilters, MenuItem, StopItemPayload } from "@/types/menu";

// Получаем все позиции меню с учетом фильтров
export async function fetchMenuItems(
  filters: MenuFilters,
): Promise<MenuItem[]> {
  const searchParams = new URLSearchParams();

  if (filters.shop) searchParams.set("shop", filters.shop);
  if (filters.status) searchParams.set("status", filters.status);

  const query = searchParams.toString();

  const response = await fetch(
    query ? `/api/menu-items?${query}` : "/api/menu-items",
  );

  if (!response.ok) throw await parseApiError(response);

  return (await response.json()) as MenuItem[];
}

// Добавляем позиции в стоп по id
export async function stopMenuItemRequest(
  id: string,
  payload: StopItemPayload,
): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/stop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw await parseApiError(response);

  return (await response.json()) as MenuItem;
}

// Возвращаем позицию в продажу по id
export async function resumeMenuItemRequest(id: string): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/resume`, {
    method: "POST",
  });

  if (!response.ok) throw await parseApiError(response);

  return (await response.json()) as MenuItem;
}
