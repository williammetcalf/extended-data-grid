import React, { FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FilterType } from "./hooks/useFilters";

export interface SelectTypeProps {
  value: FilterType;
  onChange: (type: FilterType) => void;
}

const SelectType: FC<SelectTypeProps> = (props) => {
  const { value, onChange } = props;

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Filter Type</InputLabel>
      <Select
        fullWidth
        variant="outlined"
        value={value}
        onChange={(e) => onChange(e.target.value as FilterType)}
        label="Filter Type"
      >
        <MenuItem value="contains">Contains</MenuItem>
        <MenuItem value="startsWith">Starts With</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectType;
