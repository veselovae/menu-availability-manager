import { NextResponse } from "next/server";

import { z } from "zod";
import { delay } from "@/shared/lib/delay";
import { getMenuItemById, stopMenuItem } from "@/server/menu-store";
import { stopItemSchema } from "@/shared/validation/menu";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  const item = getMenuItemById(id);

  if (!item) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Позиция не найдена" } },
      { status: 404 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Некорректное тело запроса" } },
      { status: 400 },
    );
  }

  //   Повторная валидация (на стороне сервера)
  const result = stopItemSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Некорректные данные формы",
          // Преобразует ошибки валидации в объект, сгруппированный по полям
          details: z.flattenError(result.error),
        },
      },
      { status: 400 },
    );
  }

  //   Создаем искусственную задержку
  await delay(600);

  // С вероятностью 20% возвращаем ответ с ошибкой сервера
  if (Math.random() < 0.2) {
    return NextResponse.json(
      {
        error: {
          code: "MOCK_SERVER_ERROR",
          message: "Не удалось сохранить изменения",
        },
      },
      { status: 500 },
    );
  }

  const updatedItem = stopMenuItem(id, result.data);

  return NextResponse.json(updatedItem);
}
