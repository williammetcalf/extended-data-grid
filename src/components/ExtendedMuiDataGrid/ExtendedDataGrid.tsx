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
  /**Enable copying the selected row(s) to the clipboard when ctrl+c is pressed.  */
  enableRowCopy?: boolean;
  /** Serializing function to be used when copying row data. If not specified copied data will be in a csv format.*/
  serializeRow?: (row: T, idx: number) => string;
  /**
   * Delimeter used when serializing multiple rows when copying row data
   * @default \n
   */
  serializeRowDelimeter?: string;
  deserializeRow?: (serialized: string) => T;
  /** Function called with the selected rows and serialized data when rows are copied. */
  onRowsCopied?: (rows: T[], serializedRows: string) => void;
}

/**
 *
 * @param props
 * @returns
 */
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
    serializeRowDelimeter = "\n",
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
    serializeRowDelimeter,
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
