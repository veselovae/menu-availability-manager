import { MenuFilters, MenuItem, MenuItemStatusKind, Shop } from "@/types/menu";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const shops = Object.values(Shop);
const statuses = Object.values(MenuItemStatusKind);

/*
защита от ручного изменения url и добавления нескольких значений
на один фильтр - берем только первое
*/
function getSingleValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// Парсим фильтры из searchParams для ui
export function parseMenuFilters(searchParams: RawSearchParams): MenuFilters {
  const shopValue = getSingleValue(searchParams.shop);
  const statusValue = getSingleValue(searchParams.status);

  return {
    shop: shops.find((shop) => shop === shopValue) ?? null,
    status: statuses.find((status) => status === statusValue) ?? null,
  };
}

// Фильтруем данные по выбранным фильтрам
export function filterMenuItems(
  items: MenuItem[],
  filters: MenuFilters,
): MenuItem[] {
  return items.filter((item) => {
    if (filters.shop !== null && item.shop !== filters.shop) return false;
    if (filters.status !== null && item.status.kind !== filters.status) {
      return false;
    }

    return true;
  });
}

// Формируем query-параметры для выбранных фильтров
export function buildMenuUrl(filters: MenuFilters): string {
  const searchParams = new URLSearchParams();

  if (filters.shop) searchParams.set("shop", filters.shop);
  if (filters.status) searchParams.set("status", filters.status);

  const query = searchParams.toString();

  return query ? `/?${query}` : "/";
}
