import { GridInputRowSelectionModel } from "@mui/x-data-grid";
import { RefObject, useEffect } from "react";

export default function useRowCopyListener<T>(params: {
  enableRowCopy?: boolean;
  rowSelectionModel: GridInputRowSelectionModel;
  rows: readonly T[];
  serializeRow: (row: T, idx: number) => string;
  containerRef?: RefObject<HTMLDivElement>;
  onRowsCopied?: (rows: T[], serializedRows: string) => void;
}) {
  const {
    enableRowCopy,
    rowSelectionModel,
    rows,
    serializeRow,
    containerRef: tableRef,
    onRowsCopied,
  } = params;

  useEffect(() => {
    if (!enableRowCopy) return;
    const cb = async (e: KeyboardEvent) => {
      if (!(e.ctrlKey && e.key === "c")) return;
      if (!tableRef?.current?.contains(document.activeElement)) return;
      tableRef?.current.focus();
      e.preventDefault();
      const selectedRowIds = Array.isArray(rowSelectionModel)
        ? rowSelectionModel
        : [rowSelectionModel];
      const selectedRows = selectedRowIds.map<T>((idx) => rows[idx]);
      const serializedRows = selectedRows.map(serializeRow).join("\n");
      try {
        await navigator.clipboard.writeText(serializedRows);
        onRowsCopied && onRowsCopied(selectedRows, serializedRows);
      } catch (err) {
        console.error(err);
      }
    };
    document.addEventListener("keydown", cb, true);
    return () => {
      document.removeEventListener("keydown", cb, true);
    };
  }, [
    rowSelectionModel,
    rows,
    serializeRow,
    enableRowCopy,
    tableRef,
    onRowsCopied,
  ]);
}
