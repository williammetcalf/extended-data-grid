import { RefObject, useEffect } from "react";

export default function useRowPasteListener<T>(params: {
  enableClipboardPaste?: boolean;
  containerRef?: RefObject<HTMLDivElement>;
  deserializeRows: (serializedRows: string) => any;
  validateDeserializedRows: (deserializedRows: any) => deserializedRows is T[];
  onValidRowsPasted?: (rows: T[]) => Promise<T[]>;
  onRowPasteValidationFailed?: (
    serializedRows: string,
    deserializedRows: any
  ) => any;
}) {
  const {
    enableClipboardPaste,
    containerRef,
    deserializeRows,
    validateDeserializedRows,
    onValidRowsPasted,
    onRowPasteValidationFailed,
  } = params;

  useEffect(() => {
    if (!enableClipboardPaste) return;
    if (!onValidRowsPasted) {
      console.warn(
        '<ExtendedDataGrid /> has clipboard pasting enabled, but is lacking the "onValidRowsPasted" parameter.'
      );
      return;
    }

    const cb = async (e: ClipboardEvent) => {
      if (!containerRef?.current?.contains(document.activeElement)) return;
      try {
        if (!e.clipboardData) return;
        const clipboardContent = e.clipboardData.getData("text");
        const deserializedRows = deserializeRows(clipboardContent);
        if (validateDeserializedRows(deserializedRows)) {
          await onValidRowsPasted(deserializedRows);
        } else if (onRowPasteValidationFailed) {
          onRowPasteValidationFailed(clipboardContent, deserializedRows);
        } else {
          console.error("Invalid clipboard contents", {
            clipboardContent,
            deserializedRows,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    document.addEventListener("paste", cb);
    return () => {
      document.removeEventListener("paste", cb);
    };
  }, [
    enableClipboardPaste,
    containerRef,
    deserializeRows,
    validateDeserializedRows,
    onValidRowsPasted,
    onRowPasteValidationFailed,
  ]);
}
