// Показывает фильтры и обновляет URL при выборе цеха или статуса.
"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { SHOP_LABELS } from "@/features/stop-list/model/constants";
import { buildMenuUrl } from "@/features/stop-list/model/filters";
import { MenuItemStatusKind, Shop, type MenuFilters } from "@/types/menu";

interface FiltersProps {
  filters: MenuFilters;
}

const shopOptions = [
  { value: null, label: "Все" },
  ...Object.values(Shop).map((value) => ({ value, label: SHOP_LABELS[value] })),
];

const statusOptions = [
  { value: null, label: "Все" },
  { value: MenuItemStatusKind.Available, label: "В продаже" },
  { value: MenuItemStatusKind.Stopped, label: "В стоп-листе" },
];

export function Filters({ filters }: FiltersProps) {
  const router = useRouter();

  const updateFilters = (nextFilters: MenuFilters) => {
    router.push(buildMenuUrl(nextFilters));
  };

  return (
    <div className="menu-filters">
      <FilterGroup
        name="shop"
        label="Цех:"
        options={shopOptions}
        value={filters.shop}
        onChange={(shop) => updateFilters({ ...filters, shop })}
      />
      <FilterGroup
        name="status"
        label="Статус:"
        options={statusOptions}
        value={filters.status}
        onChange={(status) => updateFilters({ ...filters, status })}
      />
    </div>
  );
}

// Вспомогательные компоненты используются только внутри фильтров.
interface FilterGroupProps<T extends string> {
  name: string;
  label: string;
  options: { value: T | null; label: string }[];
  value: T | null;
  onChange: (value: T | null) => void;
}

function FilterGroup<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
}: FilterGroupProps<T>) {
  const labelId = `${name}-filter-label`;

  return (
    <div role="group" aria-labelledby={labelId} className="filter-group">
      <span id={labelId} className="filter-label">
        {label}
      </span>
      {options.map((option) => (
        <FilterChip
          key={option.value ?? "all"}
          name={name}
          value={option.value ?? ""}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        >
          {option.label}
        </FilterChip>
      ))}
    </div>
  );
}

interface FilterChipProps {
  children: ReactNode;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}

const FilterChip = ({
  children,
  name,
  value,
  checked,
  onChange,
}: FilterChipProps) => {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        // Используем эти классы чтоб визуально скрыть input.
        // И менять span в зависимости от состояния input'а.
        className="peer sr-only"
      />
      <span className="filter-chip">{children}</span>
    </label>
  );
};
