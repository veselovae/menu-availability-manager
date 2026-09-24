"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Задаем дефолтные опции для всех запросов
        defaultOptions: {
          // retry: 1 - если запрос завершился ошибкой, повторить его один раз
          // не обновлять данные автоматически при возвращении пользователя во вкладку
          queries: { retry: 1, refetchOnWindowFocus: false },
          // не повторять неудачные операции изменения данных автоматически
          mutations: { retry: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
