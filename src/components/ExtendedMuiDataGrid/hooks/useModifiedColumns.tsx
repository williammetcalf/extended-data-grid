import {
  GridColDef,
  GridColumnHeaderParams,
  GridSlotsComponent,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { UncapitalizeObjectKeys } from "@mui/x-data-grid/internals";
import React, { useMemo } from "react";
import { SortOrder } from "./useSortOrder";
import { FieldFilter, FieldFilters } from "./useFilters";
import { Box, ButtonBase, styled } from "@mui/material";
import FilterButton from "../FilterButton";
import SortIcon from "../SortIcon";

export default function useModifiedColumns<
  T extends GridValidRowModel
>(params: {
  slots?: UncapitalizeObjectKeys<Partial<GridSlotsComponent>>;
  columns: GridColDef<T>[];
  sortOrder: SortOrder;
  filters: FieldFilters<T>;
  incrementFieldSortOrder: (label: string) => void;
  setFieldFilters: (field: string, filter: FieldFilter | null) => void;
}) {
  const { slots, columns, sortOrder, filters } = params;
  const { incrementFieldSortOrder, setFieldFilters } = params;

  return useMemo(() => {
    const ColumnSortedAscendingIcon = slots?.columnSortedAscendingIcon;
    const ColumnSortedDescendingIcon = slots?.columnSortedDescendingIcon;

    return columns.map<GridColDef>((column) => ({
      ...column,
      sortable: false,
      filterable: false,
      renderHeader: (params) => {
        const columnSortOrder = sortOrder.find(
          (fieldSort) => fieldSort.field === column.field
        );
        const columnFilters = filters[column.field];
        const renderHeader = (params: GridColumnHeaderParams<any, any, any>) =>
          column.renderHeader
            ? column.renderHeader(params)
            : column.headerName || column.field;
        return (
          <HideUntilHoverHost>
            {column.sortable ? (
              <ButtonBase onClick={() => incrementFieldSortOrder(column.field)}>
                {renderHeader(params)}
                <SortIcon
                  columnSortOrder={columnSortOrder}
                  ColumnSortedAscendingIcon={ColumnSortedAscendingIcon}
                  ColumnSortedDescendingIcon={ColumnSortedDescendingIcon}
                />
              </ButtonBase>
            ) : (
              renderHeader(params)
            )}
            {column.filterable && (
              <FilterButton
                filters={columnFilters}
                onChange={(filters) => setFieldFilters(column.field, filters)}
              />
            )}
          </HideUntilHoverHost>
        );
      },
    }));
  }, [
    slots,
    columns,
    sortOrder,
    filters,
    incrementFieldSortOrder,
    setFieldFilters,
  ]);
}

const HideUntilHoverHost = styled(Box)({
  display: "flex",
  alignItems: "center",
  "& .hide-until-hover": { opacity: 0 },
  "&:hover .hide-until-hover": { opacity: 0.2 },
});
