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
    <div className="flex gap-9">
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

/*
Оставила вспомогательные компоненты в этом файле,
поскольку они используются только внутри Filters
*/
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
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex flex-wrap items-center gap-2"
    >
      <span id={labelId} className="text-sm font-medium text-neutral-700 mr-3">
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
        // используем эти классы чтоб визуально скрыть input
        // и менять span в зависимости от состояния input'а
        className="peer sr-only"
      />
      <span
        className={`inline-flex items-center rounded-full px-4 py-1 
            border border-neutral-300 bg-white text-sm text-neutral-700
            transition-colors duration-100 hover:bg-neutral-50
            peer-checked:hover:bg-[#C6462F] peer-checked:border-[#C6462F] 
            peer-checked:bg-[#C6462F] peer-checked:text-white 
            peer-focus-visible:outline-2
        `}
      >
        {children}
      </span>
    </label>
  );
};
