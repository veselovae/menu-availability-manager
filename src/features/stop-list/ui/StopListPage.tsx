"use client";

import { useStopListUiStore } from "@/features/stop-list/model/stop-list-ui.store";
import { StopListTable } from "./StopListTable";
import { type MenuFilters } from "@/types/menu";
import { Filters } from "./Filters";
import { StopReasonPanel } from "./StopReasonPanel";
import { useQuery } from "@tanstack/react-query";
import { menuQueries } from "@/features/stop-list/model/queries";
import { StopListEmpty } from "./StopListEmpty";
import { StopListError } from "./StopListError";
import { StopListLoading } from "./StopListLoading";

interface StopListPageProps {
  filters: MenuFilters;
}

export function StopListPage({ filters }: StopListPageProps) {
  const menuQuery = useQuery(menuQueries.list(filters));
  const items = menuQuery.data ?? [];

  const { selectedItemId, isPanelOpen, openPanel, closePanel } =
    useStopListUiStore();

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  return (
    <>
      <main className="w-full mx-auto min-h-screen max-w-[1280px] px-8 py-10">
        <header>
          <p className="text-sm font-medium text-[#C6462F]">Управление меню</p>
          <h1 className="mt-1 text-3xl font-semibold">Стоп-лист кухни</h1>
        </header>

        <section className="mt-8">
          <Filters filters={filters} />
        </section>

        <section className="mt-8 ">
          {menuQuery.isPending && <StopListLoading />}

          {menuQuery.isError && (
            <StopListError
              onRetry={() => {
                void menuQuery.refetch();
              }}
            />
          )}

          {menuQuery.isSuccess && items.length === 0 && <StopListEmpty />}

          {menuQuery.isSuccess && items.length > 0 && (
            <StopListTable
              items={items}
              onOpenStopPanel={openPanel}
              onResume={() => {}}
            />
          )}
        </section>
      </main>

      {isPanelOpen && selectedItem ? (
        <StopReasonPanel
          item={selectedItem}
          onClose={closePanel}
          onSubmit={() => {}}
        />
      ) : null}
    </>
  );
}
