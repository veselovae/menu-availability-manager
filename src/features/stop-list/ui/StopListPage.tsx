// Связывает запросы, мутации и состояние интерфейса на экране стоп-листа.
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
import { Toast } from "@/shared/ui/Toast";

interface StopListPageProps {
  filters: MenuFilters;
}

export function StopListPage({ filters }: StopListPageProps) {
  const menuQuery = useQuery(menuQueries.list(filters));
  const stopMutation = useStopItem(filters);
  const resumeMutation = useResumeItem(filters);

  const items = menuQuery.data ?? [];

  const {
    selectedItemId,
    isPanelOpen,
    toastMessage,
    toastVariant,
    toastId,
    openPanel,
    closePanel,
    showToast,
    hideToast,
  } = useStopListUiStore();

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const handleStop = async (payload: StopItemPayload) => {
    if (!selectedItemId) return;

    try {
      await stopMutation.mutateAsync({ id: selectedItemId, payload });

      closePanel();
      showToast("Причина и срок стопа сохранены", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить изменения",
      );
    }
  };

  const handleResume = (itemId: string) => {
    resumeMutation.mutate(itemId, {
      onSuccess: () => {
        showToast("Позиция возвращена в продажу", "success");
      },
      onError: (error) => {
        showToast(error.message);
      },
    });
  };

  const pendingItemId = stopMutation.isPending
    ? stopMutation.variables.id
    : resumeMutation.isPending
      ? resumeMutation.variables
      : null;

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
              pendingItemId={pendingItemId}
              onOpenStopPanel={openPanel}
              onResume={handleResume}
            />
          )}
        </section>
      </main>

      {isPanelOpen && selectedItem ? (
        <StopReasonPanel
          item={selectedItem}
          isSubmitting={stopMutation.isPending}
          onClose={closePanel}
          onSubmit={handleStop}
        />
      ) : null}

      {toastMessage ? (
        <Toast
          key={toastId}
          message={toastMessage}
          variant={toastVariant}
          onClose={hideToast}
        />
      ) : null}
    </>
  );
}
