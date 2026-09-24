import { z } from "zod";

import { StopReason } from "@/types/menu";

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MS = 15 * 60 * 1000;

export const stopItemSchema = z
  .object({
    reason: z.enum(StopReason),
    untilMode: z.enum(["shift", "time"]),
    until: z.string().nullable(),
  })
  .superRefine((value, context) => {
    // Если выбрана радиокнопка "до конкретного времени,
    // то поле времени должно быть обязательным
    if (value.untilMode === "time" && !value.until) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: "Выберите время",
      });
      return;
    }

    if (value.untilMode === "shift") return;
    if (value.until === null) return;

    const timestamp = Date.parse(value.until);

    // Проверяем корректна ли дата
    if (Number.isNaN(timestamp)) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: "Укажите корректное время",
      });

      return;
    }

    // Проверяем, что дата строго в будущем
    const now = Date.now();
    if (timestamp <= now) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: "Время должно быть в будущем",
      });

      return;
    }

    // Проверяем, что дата не больше чем через 24 часа
    if (timestamp - now > MAX_AHEAD_MS) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: "Можно выбрать не больше 24 часов",
      });

      return;
    }

    // Проверка шага в 15 мин
    if (timestamp % STEP_MS !== 0) {
      context.addIssue({
        code: "custom",
        path: ["until"],
        message: "Время должно быть кратно 15 минутам",
      });
    }
  });
