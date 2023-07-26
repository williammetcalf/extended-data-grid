import {
  DataGrid,
  DataGridProps,
  GridInputRowSelectionModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import orderBy from "lodash.orderby";
import { unparse } from "papaparse";
import React, { useMemo, useRef, useState } from "react";
import defaultDeserializeRows from "./defaultDeserializeRows";
import useFilters from "./hooks/useFilters";
import useModifiedColumns from "./hooks/useModifiedColumns";
import useRowCopyListener from "./hooks/useRowCopyListener";
import useRowPasteListener from "./hooks/useRowPasteListener";
import useSortOrder from "./hooks/useSortOrder";
import defaultValidateDeserializedRows from "./defaultValidateDeserializedRows";
export interface ExtendedDataGridProps<T extends GridValidRowModel>
  extends Omit<
    DataGridProps<T>,
    "sortModel" | "sortingOrder" | "sortingMode" | "onSortModelChange"
  > {
  /**Enable copying the selected row(s) to the clipboard when ctrl+c is pressed.  */
  enableRowCopy?: boolean;
  /** Serializing function to be used when copying row data. If not specified copied data will be in a csv format.*/
  serializeRows?: (rows: T[]) => string;
  /** Function called with the selected rows and serialized data when rows are copied. */
  onRowsCopied?: (rows: T[], serializedRows: string) => void;
  enableClipboardPaste?: boolean;
  deserializeRows?: (serialized: string) => T;
  validateDeserializedRows?: (deserializedRows: any) => deserializedRows is T[];
  /**
   * Callback called before updating a row with new values in the row and cell editing.
   * @template R
   * @param {R} newRow Row object with the new values.
   * @param {T|null} originalRow - Row object with the new values or null if it's a new row.
   * @returns {Promise<R> | R} The final values to update the row.
   */
  onValidRowsPasted?: (rows: T[]) => Promise<T[]>;
  onRowPasteValidationFailed?: (
    serializedRows: string,
    deserializedRows: any
  ) => any;
}

function ExtendedDataGrid<T extends GridValidRowModel>(
  props: ExtendedDataGridProps<T>
) {
  const {
    columns,
    rows,
    serializeRows = unparse,
    enableRowCopy,
    onRowsCopied,
    enableClipboardPaste,
    deserializeRows = defaultDeserializeRows,
    validateDeserializedRows = defaultValidateDeserializedRows,
    onValidRowsPasted,
    onRowPasteValidationFailed,
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
    serializeRows,
    containerRef: ref,
    onRowsCopied,
  });
  useRowPasteListener({
    deserializeRows,
    enableClipboardPaste,
    validateDeserializedRows,
    containerRef: ref,
    onValidRowsPasted,
    onRowPasteValidationFailed,
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
