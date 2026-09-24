"use client";

import { useState } from "react";
import { useStopListUiStore } from "@/features/stop-list/model/stop-list-ui.store";
import { StopListTable } from "./StopListTable";
import {
  MenuItemStatusKind,
  type MenuFilters,
  type MenuItem,
  type StopItemPayload,
} from "@/types/menu";
import { Filters } from "./Filters";
import { StopReasonPanel } from "./StopReasonPanel";

interface StopListPageProps {
  items: MenuItem[];
  filters: MenuFilters;
}

export function StopListPage({ items, filters }: StopListPageProps) {
  const [localItems, setLocalItems] = useState(items);

  const { selectedItemId, isPanelOpen, openPanel, closePanel } =
    useStopListUiStore();

  const selectedItem =
    localItems.find((item) => item.id === selectedItemId) ?? null;

  const handleStop = (payload: StopItemPayload) => {
    if (!selectedItemId) {
      return;
    }

    setLocalItems((currentItems) =>
      currentItems.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              status: {
                kind: MenuItemStatusKind.Stopped,
                reason: payload.reason,
                until: payload.until,
              },
            }
          : item,
      ),
    );

    closePanel();
  };

  const handleResume = (itemId: string) => {
    setLocalItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: {
                kind: MenuItemStatusKind.Available,
              },
            }
          : item,
      ),
    );
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
          <StopListTable
            items={localItems}
            onOpenStopPanel={openPanel}
            onResume={handleResume}
          />
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
