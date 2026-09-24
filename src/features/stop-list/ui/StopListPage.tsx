import { menuItemsMock } from "@/mocks/menu-items";

import { StopListTable } from "./StopListTable";

export function StopListPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1280px] px-8 py-10">
      <header>
        <p className="text-sm font-medium text-[#C6462F]">Управление меню</p>
        <h1 className="mt-1 text-3xl font-semibold">Стоп-лист кухни</h1>
      </header>

      <section className="mt-8">
        <StopListTable items={menuItemsMock} />
      </section>
    </main>
  );
}
