import React, { useCallback, useState } from "react";

export type FilterType = "contains" | "startsWith";
export type FieldFilters<T> = Partial<Record<keyof T, FieldFilter>>;
export interface FieldFilter {
  multiFilterOperator: "or" | "and";
  filters: { type: FilterType; value: string; id: string }[];
}

const filterFns: Record<
  FilterType,
  (value: string, search: string) => boolean
> = {
  contains: (value, search) => value.toString().includes(search),
  startsWith: (value, search) => value.toString().startsWith(search),
};

export default function useFilters<T = any>(): [
  FieldFilters<T>,
  (field: string, filter: FieldFilter | null) => void,
  (data: T[]) => T[]
] {
  const [filters, setFilters] = useState<FieldFilters<T>>({});

  const setFieldFilter = useCallback(
    (field: string, filter: FieldFilter | null) => {
      if (!filter) {
        const updatedFilters = { ...filters };
        delete updatedFilters[field];
        setFilters(updatedFilters);
      } else {
        setFilters({ ...filters, [field]: filter });
      }
    },
    [filters, setFilters]
  );

  const filterData = useCallback(
    (data: T[]) => {
      return data.filter((row) => {
        return Object.keys(filters).every((field) => {
          const filter = filters[field] as FieldFilter | undefined;
          if (!filter || !filter.filters.length) return true;
          if (filter.multiFilterOperator === "or") {
            return filter.filters.some((filter) => {
              const fn = filterFns[filter.type];
              return fn(row[field], filter.value);
            });
          } else if (filter.multiFilterOperator === "and") {
            return filter.filters.every((filter) => {
              const fn = filterFns[filter.type];
              return fn(row[field], filter.value);
            });
          }
          return true;
        });
      });
    },
    [filters]
  );

  return [filters, setFieldFilter, filterData];
}
