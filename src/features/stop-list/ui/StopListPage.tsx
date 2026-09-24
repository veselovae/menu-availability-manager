"use client";

import { useStopListUiStore } from "@/features/stop-list/model/stop-list-ui.store";
import { StopListTable } from "./StopListTable";
import { Filters } from "./Filters";
import { StopReasonPanel } from "./StopReasonPanel";
import { useQuery } from "@tanstack/react-query";
import { menuQueries } from "@/features/stop-list/model/queries";
import { StopListEmpty } from "./StopListEmpty";
import { StopListError } from "./StopListError";
import { StopListLoading } from "./StopListLoading";
import { useStopItem } from "@/features/stop-list/model/use-stop-item";
import { useResumeItem } from "@/features/stop-list/model/use-resume-item";
import type { MenuFilters, StopItemPayload } from "@/types/menu";

interface StopListPageProps {
  filters: MenuFilters;
}

export function StopListPage({ filters }: StopListPageProps) {
  const menuQuery = useQuery(menuQueries.list(filters));
  const stopMutation = useStopItem(filters);
  const resumeMutation = useResumeItem(filters);

  const items = menuQuery.data ?? [];

  const { selectedItemId, isPanelOpen, openPanel, closePanel } =
    useStopListUiStore();

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const handleStop = (payload: StopItemPayload) => {
    if (!selectedItemId) return;

    stopMutation.mutate({ id: selectedItemId, payload });

    closePanel();
  };

  const handleResume = (itemId: string) => {
    resumeMutation.mutate(itemId);
  };

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
              onResume={handleResume}
            />
          )}
        </section>
      </main>

      {isPanelOpen && selectedItem ? (
        <StopReasonPanel
          item={selectedItem}
          onClose={closePanel}
          onSubmit={handleStop}
        />
      ) : null}
    </>
  );
}
