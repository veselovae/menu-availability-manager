import { StopListTable } from "./StopListTable";
import type { MenuFilters, MenuItem } from "@/types/menu";
import { Filters } from "./Filters";

interface StopListPageProps {
  items: MenuItem[];
  filters: MenuFilters;
}

export function StopListPage({ items, filters }: StopListPageProps) {
  return (
    <main className="w-full mx-auto min-h-screen max-w-[1280px] px-8 py-10">
      <header>
        <p className="text-sm font-medium text-[#C6462F]">Управление меню</p>
        <h1 className="mt-1 text-3xl font-semibold">Стоп-лист кухни</h1>
      </header>

      <section className="mt-8">
        <Filters filters={filters} />
      </section>

      <section className="mt-8 ">
        <StopListTable items={items} />
      </section>
    </main>
  );
}
