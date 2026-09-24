"use client";

import { useState } from "react";

import { STOP_REASON_LABELS } from "@/features/stop-list/model/constants";
import { getStopTimeOptions } from "@/features/stop-list/model/stop-time";
import { Button } from "@/shared/ui/Button";
import {
  MenuItemStatusKind,
  StopReason,
  type MenuItem,
  type StopItemPayload,
} from "@/types/menu";
import { formatDateTime } from "@/shared/lib/date";

interface StopReasonPanelProps {
  item: MenuItem;
  onClose: () => void;
  onSubmit: (payload: StopItemPayload) => void;
}

type UntilMode = "shift" | "time";

const UNTIL_MODE_OPTIONS: { value: UntilMode; label: string }[] = [
  { value: "shift", label: "До конца смены" },
  { value: "time", label: "До конкретного времени" },
];

export function StopReasonPanel({
  item,
  onClose,
  onSubmit,
}: StopReasonPanelProps) {
  // Стейт причины стопа
  const [reason, setReason] = useState<StopReason>(
    item.status.kind === MenuItemStatusKind.Stopped
      ? item.status.reason
      : StopReason.OutOfStock,
  );

  // Стейт режима стопаЖ до конца смены или до конкретного времени
  const [untilMode, setUntilMode] = useState<"shift" | "time">(
    item.status.kind === MenuItemStatusKind.Stopped && item.status.until
      ? "time"
      : "shift",
  );

  // Стейт конкретного времени
  const [until, setUntil] = useState(
    item.status.kind === MenuItemStatusKind.Stopped && item.status.until
      ? item.status.until
      : "",
  );

  const [timeOptions, setTimeOptions] = useState(() => getStopTimeOptions());
  const [timeError, setTimeError] = useState<string | null>(null);

  const selectedUntil = until;

  const handleSubmit = () => {
    if (untilMode === "time") {
      const timestamp = new Date(selectedUntil).getTime();
      const now = Date.now();

      if (
        !Number.isFinite(timestamp) ||
        timestamp <= now ||
        timestamp > now + 24 * 60 * 60 * 1000
      ) {
        setTimeOptions(getStopTimeOptions());
        setUntil("");
        setTimeError("Выберите время в будущем в пределах ближайших 24 часов.");
        return;
      }
    }

    onSubmit({
      reason,
      until: untilMode === "shift" ? null : selectedUntil,
    });
  };

  const handleUntilModeChange = (mode: UntilMode) => {
    if (mode === "time") {
      setTimeOptions(getStopTimeOptions());
    }

    setUntilMode(mode);
    setTimeError(null);
  };

  return (
    <>
      {/* бэкгрунд для закрытия через клик мимо панели */}
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* панель */}
      <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-[440px] flex-col border-l border-neutral-200 bg-white shadow-xl">
        <header className="border-b border-neutral-200 p-6">
          <p className="text-sm text-neutral-500">
            {item.status.kind === MenuItemStatusKind.Stopped
              ? "Редактирование стопа"
              : "Постановка в стоп-лист"}
          </p>

          <h2 className="mt-1 text-xl font-semibold">{item.title}</h2>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <label className="block">
            <span className="text-sm font-medium">Причина</span>

            <select
              value={reason}
              className="mt-2 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3"
              onChange={(event) => {
                setReason(event.target.value as StopReason);
              }}
            >
              {Object.entries(STOP_REASON_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="text-sm font-medium">Срок стопа</legend>

            {UNTIL_MODE_OPTIONS.map(({ value, label }) => (
              <label key={value} className="mt-3 flex items-center gap-3">
                <input
                  type="radio"
                  name="until-mode"
                  value={value}
                  checked={untilMode === value}
                  onChange={() => handleUntilModeChange(value)}
                />

                <span>{label}</span>
              </label>
            ))}

            {untilMode === "time" ? (
              <>
                <select
                  value={selectedUntil}
                  className="mt-3 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3"
                  onFocus={() => setTimeOptions(getStopTimeOptions())}
                  onChange={(event) => {
                    setUntil(event.target.value);
                    setTimeError(null);
                  }}
                >
                  <option value="" disabled>
                    Выберите время
                  </option>

                  {selectedUntil &&
                  !timeOptions.some(
                    (option) => option.value === selectedUntil,
                  ) ? (
                    // Отображаем этот вариант, если переданного
                    // значения нет среди опций селекта
                    <option value={selectedUntil}>
                      {formatDateTime(selectedUntil)} (выбрано)
                    </option>
                  ) : null}

                  {/* Опции с учетом шага 15 мин */}
                  {timeOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                {timeError ? (
                  <p className="mt-2 text-sm text-red-600">{timeError}</p>
                ) : null}
              </>
            ) : null}
          </fieldset>
        </div>

        <footer className="flex justify-end gap-3 border-t border-neutral-200 p-6">
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>

          <Button onClick={handleSubmit}>
            {item.status.kind === MenuItemStatusKind.Stopped
              ? "Сохранить"
              : "Поставить в стоп"}
          </Button>
        </footer>
      </aside>
    </>
  );
}
