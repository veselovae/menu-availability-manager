import { z } from "zod";

import { StopReason } from "@/types/menu";

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MS = 15 * 60 * 1000;

const untilSchema = z
  .string()
  .nullable()
  .superRefine((value, context) => {
    if (value === null) return;

    const timestamp = Date.parse(value);

    // Проверяем корректна ли дата
    if (Number.isNaN(timestamp)) {
      context.addIssue({
        code: "custom",
        message: "Укажите корректное время",
      });

      return;
    }

    // Проверяем, что дата строго в будущем
    const now = Date.now();
    if (timestamp <= now) {
      context.addIssue({
        code: "custom",
        message: "Время должно быть в будущем",
      });

      return;
    }

    // Проверяем, что дата не больше чем через 24 часа
    if (timestamp - now > MAX_AHEAD_MS) {
      context.addIssue({
        code: "custom",
        message: "Можно выбрать не больше 24 часов",
      });

      return;
    }

    // Проверка шага в 15 мин
    if (timestamp % STEP_MS !== 0) {
      context.addIssue({
        code: "custom",
        message: "Время должно быть кратно 15 минутам",
      });
    }
  });

/*
Схемы были разделены на две: 
1. stopItemSchema используется для валидации данных API;
2. stopItemFormSchema расширяет её полем untilMode, которое нужно форме,
но не передаётся на сервер
*/

export const stopItemSchema = z.object({
  reason: z.enum(StopReason),
  until: untilSchema,
});

export const stopItemFormSchema = stopItemSchema
  .extend({ untilMode: z.enum(["shift", "time"]) })
  .superRefine((value, context) => {
    if (value.untilMode === "time" && value.until === null) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: "Выберите время",
      });
    }
  });
