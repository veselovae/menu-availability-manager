// Показывает форму создания и редактирования стопа с проверкой полей.
"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Icon } from "@/shared/ui/Icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { stopItemFormSchema } from "@/shared/validation/menu";
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

type StopFormValues = z.infer<typeof stopItemFormSchema>;

interface StopReasonPanelProps {
  item: MenuItem;
  isSubmitting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (payload: StopItemPayload) => void;
}

type UntilMode = StopFormValues["untilMode"];

const UNTIL_MODE_OPTIONS: { value: UntilMode; label: string }[] = [
  { value: "shift", label: "До конца смены" },
  { value: "time", label: "До конкретного времени" },
];

const REASON_OPTIONS = Object.entries(STOP_REASON_LABELS).map(
  ([value, label]) => ({ value, label }),
);

// Формирует начальные значения формы.
function getDefaultValues(item: MenuItem): StopFormValues {
  const status = item.status;
  const until =
    status.kind === MenuItemStatusKind.Stopped ? status.until : null;

  return {
    reason:
      status.kind === MenuItemStatusKind.Stopped
        ? status.reason
        : StopReason.OutOfStock,
    until,
    untilMode: until === null ? "shift" : "time",
  };
}

// Проверяет наличие времени в списке.
function hasOption(options: SelectOption[], value: string | null): boolean {
  return options.some((option) => option.value === value);
}

export function StopReasonPanel({
  item,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: StopReasonPanelProps) {
  const isEditing = item.status.kind === MenuItemStatusKind.Stopped;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const [timeOptions, setTimeOptions] = useState(() => getStopTimeOptions());

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<StopFormValues>({
    resolver: zodResolver(stopItemFormSchema),
    mode: "onBlur",
    defaultValues: getDefaultValues(item),
  });

  const untilMode = useWatch({ name: "untilMode", control });
  const until = useWatch({ name: "until", control });

  const handleUntilModeChange = (mode: UntilMode) => {
    setValue("untilMode", mode, { shouldDirty: true });

    // Если выбираем "до конца смены", то очищаем время.
    if (mode === "shift") {
      setValue("until", null, { shouldDirty: true, shouldValidate: true });

      return;
    }

    // Если выбрали "до конкретного времени", то рассчитываем актуальные опции.
    const options = getStopTimeOptions();

    setTimeOptions(options);

    if (hasOption(options, until)) return;

    setValue("until", null, {
      shouldDirty: true,
    });
  };

  const submitForm = (values: StopFormValues) => {
    onSubmit({
      reason: values.reason,
      until: values.until,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className="stop-dialog"
      aria-labelledby="stop-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || isSubmitting) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <header className="border-b border-neutral-200 p-6">
        <button
          type="button"
          className="app-button button-ghost float-right"
          aria-label="Закрыть панель"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <Icon name="close" />
        </button>
        <p className="text-sm text-neutral-500">
          {isEditing ? "Редактирование стопа" : "Постановка в стоп-лист"}
        </p>

        <h2 id="stop-dialog-title" className="mt-2 text-2xl font-semibold">
          {item.title}
        </h2>
        <p className="mt-3 text-sm text-neutral-500">
          Укажите причину и срок. Позицию можно будет вернуть в продажу.
        </p>
      </header>

      <form
        id="stop-item-form"
        className="flex flex-1 flex-col space-y-6 p-6"
        onSubmit={handleSubmit(submitForm)}
      >
        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}
        <label className="block">
          <span className="text-sm font-medium">Причина</span>

          <FormSelect
            {...register("reason")}
            options={REASON_OPTIONS}
            error={errors.reason?.message}
            className="mt-2 h-11"
            errorClassName="mt-1"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-medium">Срок стопа</legend>

          <div className="mt-3 space-y-3">
            {UNTIL_MODE_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  {...register("untilMode")}
                  value={value}
                  checked={untilMode === value}
                  onChange={() => {
                    handleUntilModeChange(value);
                  }}
                />

                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          {untilMode === "time" ? (
            <div className="mt-3">
              <FormSelect
                {...register("until", {
                  setValueAs: (value: string | null) => value || null,
                })}
                value={until ?? ""}
                options={timeOptions}
                aria-label="Время окончания стопа"
                error={errors.until?.message}
                className="h-10 text-sm"
                errorClassName="mt-2"
                onFocus={() => {
                  setTimeOptions(getStopTimeOptions());
                }}
                onChange={(event) => {
                  const value = event.target.value;

                  setValue("until", value || null, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                <option value="" disabled>
                  Выберите время
                </option>

                {until && !hasOption(timeOptions, until) ? (
                  <option value={until}>
                    {formatDateTime(until)} (выбрано)
                  </option>
                ) : null}
              </FormSelect>
            </div>
          ) : null}
        </fieldset>
      </form>

      <footer className="flex justify-end gap-3 border-t border-neutral-200 p-6">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Отмена
        </Button>

        <Button
          type="submit"
          form="stop-item-form"
          disabled={Object.keys(errors).length > 0}
          loading={isSubmitting}
        >
          {isSubmitting
            ? "Сохраняется..."
            : item.status.kind === "stopped"
              ? "Сохранить"
              : "Поставить в стоп"}
        </Button>
      </footer>
    </dialog>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends ComponentProps<"select"> {
  options: SelectOption[];
  error?: string;
  errorClassName?: string;
}

function FormSelect({
  options,
  error,
  className = "",
  errorClassName = "",
  children,
  ...props
}: FormSelectProps) {
  const selectClassName = [
    "w-full rounded-lg border bg-white px-3 outline-none",
    error ? "border-red-500" : "border-neutral-300 focus:border-neutral-500",
    className,
  ].join(" ");

  return (
    <>
      <select {...props} className={selectClassName}>
        {children}
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error ? (
        <p className={`text-sm text-red-600 ${errorClassName}`}>{error}</p>
      ) : null}
    </>
  );
}
