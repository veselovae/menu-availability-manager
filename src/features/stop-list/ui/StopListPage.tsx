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
import { Icon } from "@/shared/ui/Icon";
import { useState } from "react";
import Link from "next/link";

interface StopListPageProps {
  filters: MenuFilters;
}

export function StopListPage({ filters }: StopListPageProps) {
  const menuQuery = useQuery(menuQueries.list(filters));
  const stopMutation = useStopItem(filters);
  const resumeMutation = useResumeItem(filters);

  const items = menuQuery.data ?? [];
  const [search, setSearch] = useState("");
  const visibleItems = items.filter((item) =>
    item.title
      .toLocaleLowerCase("ru")
      .includes(search.trim().toLocaleLowerCase("ru")),
  );
  const stoppedCount = visibleItems.filter(
    (item) => item.status.kind === "stopped",
  ).length;

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
      <div className="app-topbar">
        <Link href="/" className="brand" aria-label="Стоп-лист — главная">
          <span className="brand-mark">
            <Icon name="plate" size={25} />
          </span>
          стоп-лист<span className="brand-dot">.</span>
        </Link>
        <div className="topbar-section">
          <Icon name="menu" size={17} /> Управление меню
        </div>
        <span className="demo-label">Демо-пространство</span>
      </div>
      <main className="workspace">
        <header className="page-heading">
          <div>
            <p className="eyebrow">МЕНЮ ПОД КОНТРОЛЕМ</p>
            <h1>
              Стоп-лист<span className="heading-dot">.</span>
            </h1>
            <p className="page-description">
              Всё, что нужно знать о доступности блюд, в одном месте.
            </p>
          </div>
          <span className="workspace-label">
            <span /> Кухня · Бар · Кондитерская
          </span>
        </header>
        <section
          className="summary-grid"
          aria-label="Сводка по текущей выборке"
        >
          {(
            [
              {
                label: "Позиций в выборке",
                count: visibleItems.length,
                icon: "menu",
                tone: "neutral",
                hint: "С учётом фильтров и поиска",
              },
              {
                label: "В продаже",
                count: visibleItems.length - stoppedCount,
                icon: "check",
                tone: "green",
                hint: "Готовы к заказу",
              },
              {
                label: "В стоп-листе",
                count: stoppedCount,
                icon: "pause",
                tone: "orange",
                hint: "Временно недоступны",
              },
              {
                label: "Заканчиваются",
                count: visibleItems.filter(
                  (item) => item.stock > 0 && item.stock <= 5,
                ).length,
                icon: "stock",
                tone: "sand",
                hint: "Осталось 5 порций или меньше",
              },
            ] as const
          ).map((stat) => (
            <div className={`summary-card ${stat.tone}`} key={stat.label}>
              <div className="summary-top">
                <span>{stat.label}</span>
                <span className="summary-icon">
                  <Icon name={stat.icon} />
                </span>
              </div>
              <strong>{menuQuery.isSuccess ? stat.count : "—"}</strong>
              <p>{stat.hint}</p>
            </div>
          ))}
        </section>
        <section className="menu-surface" aria-label="Позиции меню">
          <div className="menu-toolbar">
            <div className="menu-title">
              <h2>Позиции меню</h2>
              <span>{menuQuery.isSuccess ? visibleItems.length : "—"}</span>
            </div>
            <label className="search-field">
              <Icon name="search" size={18} />
              <input
                type="search"
                aria-label="Поиск блюда"
                placeholder="Найти блюдо или напиток…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>
          <Filters filters={filters} />
          {menuQuery.isPending && <StopListLoading />}

          {menuQuery.isError && (
            <StopListError
              onRetry={() => {
                void menuQuery.refetch();
              }}
            />
          )}

          {menuQuery.isSuccess && visibleItems.length === 0 && (
            <StopListEmpty />
          )}

          {menuQuery.isSuccess && visibleItems.length > 0 && (
            <StopListTable
              items={visibleItems}
              pendingItemId={pendingItemId}
              onOpenStopPanel={(itemId) => {
                stopMutation.reset();
                openPanel(itemId);
              }}
              onResume={handleResume}
            />
          )}
        </section>
        <footer className="workspace-footer">
          <span>Забота о рабочем дне</span>
          <span>Управление доступностью меню</span>
        </footer>
      </main>

      {isPanelOpen && selectedItem ? (
        <StopReasonPanel
          item={selectedItem}
          isSubmitting={stopMutation.isPending}
          errorMessage={stopMutation.error?.message}
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
