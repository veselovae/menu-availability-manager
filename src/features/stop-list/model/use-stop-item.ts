// Сохраняет стоп с оптимистичным обновлением, откатом и синхронизацией кэша.
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { stopMenuItemRequest } from "@/features/stop-list/api/menu-api";
import { menuKeys } from "@/features/stop-list/model/queries";
import {
  MenuItemStatusKind,
  type MenuFilters,
  type MenuItem,
  type StopItemPayload,
} from "@/types/menu";

interface StopItemVariables {
  id: string;
  payload: StopItemPayload;
}

interface StopItemContext {
  previousItems: MenuItem[] | undefined;
}

export function useStopItem(filters: MenuFilters) {
  const queryClient = useQueryClient();

  // Получаем доступ к кэшу текущего списка.
  const listKey = menuKeys.list(filters);

  return useMutation<MenuItem, Error, StopItemVariables, StopItemContext>({
    mutationFn: ({ id, payload }) => stopMenuItemRequest(id, payload),

    // Обновляем интерфейс до отправки запроса (оптимистичное обновление).
    onMutate: async ({ id, payload }) => {
      // Отменяем текущий запрос для предотвращения перезаписи оптимистичного обновления.
      await queryClient.cancelQueries({ queryKey: listKey });

      // Сохраняем прежний список.
      const previousItems = queryClient.getQueryData<MenuItem[]>(listKey);

      // Заменяем статус нужной позиции на Stopped.
      queryClient.setQueryData<MenuItem[]>(listKey, (currentItems = []) =>
        currentItems.map((item) =>
          item.id === id
            ? {
                ...item,
                status: { kind: MenuItemStatusKind.Stopped, ...payload },
              }
            : item,
        ),
      );

      return { previousItems };
    },

    // При ошибке запроса в кэш возвращается сохраненный список.
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(listKey, context.previousItems);
      }
    },

    // Синхронизируем данные с сервером.
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}
