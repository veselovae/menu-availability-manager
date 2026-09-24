// Задает ключи кэша и настройки запросов списка меню.
import { queryOptions } from "@tanstack/react-query";

import { fetchMenuItems } from "@/features/stop-list/api/menu-api";
import type { MenuFilters } from "@/types/menu";

// Задаем ключи кэша.
export const menuKeys = {
  // Общий префикс для всех запросов меню.
  all: ["menu-items"] as const,
  // Префикс для списков.
  lists: () => [...menuKeys.all, "list"] as const,
  // Ключ конкретного списка с фильтрами.
  list: (filters: MenuFilters) => [...menuKeys.lists(), filters] as const,
};

export const menuQueries = {
  list: (filters: MenuFilters) =>
    queryOptions({
      queryKey: menuKeys.list(filters),
      queryFn: () => fetchMenuItems(filters),
    }),
};
