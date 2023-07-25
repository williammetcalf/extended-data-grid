import { IconButton, Popover } from "@mui/material";
import { GridFilterAltIcon } from "@mui/x-data-grid";
import React, { FC, useState } from "react";
import ManageFilters from "./ManageFilters";
import { FieldFilter } from "./hooks/useFilters";

export interface FilterButtonProps {
  filters?: FieldFilter;
  onChange: (filters: FieldFilter) => void;
}

const FilterButton: FC<FilterButtonProps> = (props) => {
  const { filters, onChange } = props;
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <GridFilterAltIcon
          className={
            filters?.filters.length || anchor ? undefined : "hide-until-hover"
          }
          fontSize="small"
        />
      </IconButton>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <ManageFilters filters={filters} onChange={onChange} />
      </Popover>
    </>
  );
};

export default FilterButton;
