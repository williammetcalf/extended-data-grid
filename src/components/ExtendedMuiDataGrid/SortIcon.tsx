import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridSlotsComponent,
} from "@mui/x-data-grid";
import React, { FC } from "react";
import { SortOrderField } from "./hooks/useSortOrder";

export interface SortIconProps {
  columnSortOrder?: SortOrderField;
  ColumnSortedAscendingIcon?: GridSlotsComponent["ColumnSortedAscendingIcon"];
  ColumnSortedDescendingIcon?: GridSlotsComponent["ColumnSortedDescendingIcon"];
}

const SortIcon: FC<SortIconProps> = (props) => {
  const {
    columnSortOrder,
    ColumnSortedAscendingIcon,
    ColumnSortedDescendingIcon,
  } = props;

  return (
    <>
      {columnSortOrder?.order === "asc" &&
        (ColumnSortedAscendingIcon ? (
          <ColumnSortedAscendingIcon />
        ) : (
          <GridArrowUpwardIcon fontSize="small" />
        ))}
      {columnSortOrder?.order === "desc" &&
        (ColumnSortedDescendingIcon ? (
          <ColumnSortedDescendingIcon />
        ) : (
          <GridArrowDownwardIcon fontSize="small" />
        ))}
      {!columnSortOrder &&
        (ColumnSortedAscendingIcon ? (
          <ColumnSortedAscendingIcon className="hide-until-hover" />
        ) : (
          <GridArrowUpwardIcon fontSize="small" className="hide-until-hover" />
        ))}
    </>
  );
};

export default SortIcon;
