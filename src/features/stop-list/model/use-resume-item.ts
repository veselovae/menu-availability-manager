"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resumeMenuItemRequest } from "@/features/stop-list/api/menu-api";
import { menuKeys } from "@/features/stop-list/model/queries";
import {
  MenuItemStatusKind,
  type MenuFilters,
  type MenuItem,
} from "@/types/menu";

interface ResumeItemContext {
  previousItems: MenuItem[] | undefined;
}

// Последовательность аналогичная src\features\stop-list\model\use-stop-item.ts
export function useResumeItem(filters: MenuFilters) {
  const queryClient = useQueryClient();

  const listKey = menuKeys.list(filters);

  return useMutation<MenuItem, Error, string, ResumeItemContext>({
    mutationFn: resumeMenuItemRequest,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousItems = queryClient.getQueryData<MenuItem[]>(listKey);

      queryClient.setQueryData<MenuItem[]>(listKey, (currentItems = []) =>
        currentItems.map((item) =>
          item.id === id
            ? { ...item, status: { kind: MenuItemStatusKind.Available } }
            : item,
        ),
      );

      return { previousItems };
    },

    onError: (_error, _id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(listKey, context.previousItems);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}
