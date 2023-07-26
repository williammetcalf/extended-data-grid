import {
  DataGrid,
  DataGridProps,
  GridInputRowSelectionModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import orderBy from "lodash.orderby";
import React, { useMemo, useRef, useState } from "react";
import { serializeRow as defaultSerializeRow } from "../../lib";
import useFilters from "./hooks/useFilters";
import useModifiedColumns from "./hooks/useModifiedColumns";
import useRowCopyListener from "./hooks/useRowCopyListener";
import useSortOrder from "./hooks/useSortOrder";
export interface ExtendedDataGridProps<T extends GridValidRowModel>
  extends Omit<
    DataGridProps<T>,
    "sortModel" | "sortingOrder" | "sortingMode" | "onSortModelChange"
  > {
  serializeRow?: (row: T, idx: number) => string;
  deserializeRow?: (serialized: string) => T;
  enableRowCopy?: boolean;
  onRowsCopied?: (rows: T[], serializedRows: string) => void;
}

function ExtendedDataGrid<T extends GridValidRowModel>(
  props: ExtendedDataGridProps<T>
) {
  const {
    columns,
    rows,
    serializeRow = defaultSerializeRow,
    deserializeRow,
    enableRowCopy,
    onRowsCopied,
    ...rest
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [sortOrder, incrementFieldSortOrder] = useSortOrder();
  const [filters, setFieldFilters, filterData] = useFilters();
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridInputRowSelectionModel>(props.rowSelectionModel || []);
  const modifiedColumns = useModifiedColumns({
    columns,
    filters,
    incrementFieldSortOrder,
    setFieldFilters,
    sortOrder,
    slots: props.slots,
  });
  const sortedRows = useMemo(() => {
    return orderBy(
      filterData([...rows]),
      sortOrder.map(({ field }) => field),
      sortOrder.map(({ order }) => order)
    );
  }, [rows, sortOrder, filterData]);
  useRowCopyListener({
    enableRowCopy,
    rows,
    rowSelectionModel,
    serializeRow,
    containerRef: ref,
    onRowsCopied,
  });

  return (
    <div tabIndex={0} ref={ref}>
      <DataGrid
        {...rest}
        columns={modifiedColumns}
        rows={sortedRows}
        onRowSelectionModelChange={setRowSelectionModel}
        rowSelectionModel={rowSelectionModel}
      />
    </div>
  );
}

export default ExtendedDataGrid;
