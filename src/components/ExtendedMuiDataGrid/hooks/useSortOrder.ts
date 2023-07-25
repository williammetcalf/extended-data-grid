import React, { useCallback, useState } from "react";

export type SortOrderDirection = "asc" | "desc";
export type SortOrderField = { field: string; order: SortOrderDirection };
export type SortOrder = SortOrderField[];

export default function useSortOrder(): [SortOrder, (field: string) => void] {
  const [sortOrder, setSortOrder] = useState<SortOrder>([]);

  const incrementFieldSortOrder = useCallback(
    (field: string) => {
      const fieldIdx = sortOrder.findIndex(
        (sortField) => sortField.field === field
      );
      if (fieldIdx === -1) {
        setSortOrder([...sortOrder, { field, order: "asc" }]);
      } else {
        const sortField = sortOrder[fieldIdx];
        const updatedSortOrder = [...sortOrder];
        if (sortField.order === "asc") {
          updatedSortOrder[fieldIdx] = { field, order: "desc" };
        } else {
          updatedSortOrder.splice(fieldIdx, 1);
        }
        setSortOrder(updatedSortOrder);
      }
    },
    [sortOrder, setSortOrder]
  );

  return [sortOrder, incrementFieldSortOrder];
}
