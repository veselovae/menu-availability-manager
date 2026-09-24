import { NextResponse } from "next/server";

import { delay } from "@/shared/lib/delay";
import { getMenuItemById, resumeMenuItem } from "@/server/menu-store";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const item = getMenuItemById(id);

  if (!item) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Позиция не найдена" } },
      { status: 404 },
    );
  }

  // Проверяем остаток на сервере: запрос может прийти в обход интерфейса
  if (item.stock === 0) {
    return NextResponse.json(
      {
        error: {
          code: "OUT_OF_STOCK",
          message: "Нельзя вернуть позицию при остатке 0",
        },
      },
      { status: 409 },
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
      {
        status: 500,
      },
    );
  }

  const updatedItem = resumeMenuItem(id);

  return NextResponse.json(updatedItem);
}
