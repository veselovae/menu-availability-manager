import { NextResponse } from "next/server";

import { delay } from "@/shared/lib/delay";
import { getMenuItems } from "@/server/menu-store";
import type { MenuItemStatusKind, Shop } from "@/types/menu";
import { MENU_ITEM_STATUSES, SHOPS } from "@/shared/constants/menu";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const shopParam = searchParams.get("shop");
  const statusParam = searchParams.get("status");

  if (shopParam !== null && !SHOPS.includes(shopParam as Shop)) {
    return NextResponse.json(
      { error: { code: "INVALID_SHOP", message: "Некорректный цех" } },
      { status: 400 },
    );
  }

  if (
    statusParam !== null &&
    !MENU_ITEM_STATUSES.includes(statusParam as MenuItemStatusKind)
  ) {
    return NextResponse.json(
      { error: { code: "INVALID_STATUS", message: "Некорректный статус" } },
      { status: 400 },
    );
  }

  //   Создаем искусственную задержку
  await delay(500);

  const items = getMenuItems().filter((item) => {
    if (shopParam && item.shop !== shopParam) return false;
    if (statusParam && item.status.kind !== statusParam) return false;

    return true;
  });

  return NextResponse.json(items);
}
