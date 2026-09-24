// Извлекает сообщение из ответа API и подставляет запасной текст ошибки.
import { z } from "zod";

const apiErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
});

export const parseApiError = async (response: Response): Promise<Error> => {
  const data: unknown = await response.json().catch(() => null);
  const result = apiErrorResponseSchema.safeParse(data);

  return new Error(
    result.success ? result.data.error.message : "Произошла неизвестная ошибка",
  );
};
