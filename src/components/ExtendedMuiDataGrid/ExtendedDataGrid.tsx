import { Box, ButtonBase, styled } from "@mui/material";
import { DataGrid, DataGridProps, GridColDef } from "@mui/x-data-grid";
import orderBy from "lodash.orderby";
import { FC, useMemo } from "react";
import FilterButton from "./FilterButton";
import SortIcon from "./SortIcon";
import useFilters from "./hooks/useFilters";
import useSortOrder from "./hooks/useSortOrder";

export interface ExtendedDataGridProps
  extends Omit<
    DataGridProps,
    "sortModel" | "sortingOrder" | "sortingMode" | "onSortModelChange"
  > {}

const ExtendedDataGrid: FC<ExtendedDataGridProps> = (props) => {
  const { columns, rows, ...rest } = props;
  const [sortOrder, incrementFieldSortOrder] = useSortOrder();
  const [filters, setFieldFilters, filterData] = useFilters();

  const modifiedColumns = useMemo(() => {
    const ColumnSortedAscendingIcon = props.slots?.columnSortedAscendingIcon;
    const ColumnSortedDescendingIcon = props.slots?.columnSortedDescendingIcon;

    return columns.map<GridColDef>((column) => ({
      ...column,
      sortable: false,
      filterable: false,
      renderHeader: (params) => {
        if (!column.sortable)
          return column.renderHeader
            ? column.renderHeader(params)
            : column.headerName;

        const columnSortOrder = sortOrder.find(
          (fieldSort) => fieldSort.field === column.field
        );
        const columnFilters = filters[column.field];
        return (
          <HideUntilHoverHost>
            <ButtonBase onClick={() => incrementFieldSortOrder(column.field)}>
              {column.renderHeader
                ? column.renderHeader(params)
                : column.headerName}
              <SortIcon
                columnSortOrder={columnSortOrder}
                ColumnSortedAscendingIcon={ColumnSortedAscendingIcon}
                ColumnSortedDescendingIcon={ColumnSortedDescendingIcon}
              />
            </ButtonBase>
            <FilterButton
              filters={columnFilters}
              onChange={(filters) => setFieldFilters(column.field, filters)}
            />
          </HideUntilHoverHost>
        );
      },
    }));
  }, [columns, sortOrder, filters]);

  const sortedRows = useMemo(() => {
    return orderBy(
      filterData([...rows]),
      sortOrder.map(({ field }) => field),
      sortOrder.map(({ order }) => order)
    );
  }, [rows, sortOrder, filterData]);

  return <DataGrid {...rest} columns={modifiedColumns} rows={sortedRows} />;
};

const HideUntilHoverHost = styled(Box)({
  display: "flex",
  alignItems: "center",
  "& .hide-until-hover": { opacity: 0 },
  "&:hover .hide-until-hover": { opacity: 0.2 },
});

export default ExtendedDataGrid;
