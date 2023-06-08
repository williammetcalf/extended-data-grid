import { Button, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { FC, useState } from "react";
import SelectType from "./SelectType";
import { FilterType } from "./hooks/useFilters";

export interface FilterItemProps {
  type: FilterType;
  value: string;
  onChange: (type: FilterType, value: string) => void;
  enableDelete?: boolean;
  autoSave?: boolean;
}

const FilterItem: FC<FilterItemProps> = (props) => {
  const { type, value, onChange, autoSave } = props;
  const [updatedType, setUpdatedType] = useState(type);
  const [updatedValue, setUpdatedValue] = useState(value);

  return (
    <Grid2 container spacing={1}>
      <Grid2 xs={5}>
        <SelectType
          value={updatedType}
          onChange={(e) => {
            setUpdatedType(e);
            autoSave && onChange(e, updatedValue);
          }}
        />
      </Grid2>
      <Grid2 xs={7}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Value"
          value={updatedValue}
          onChange={(e) => {
            setUpdatedValue(e.target.value);
            autoSave && onChange(updatedType, e.target.value);
          }}
        />
      </Grid2>
      {!autoSave && (
        <Grid2 xs={12}>
          <Button
            fullWidth
            variant="contained"
            disabled={!updatedValue.length}
            onClick={() => {
              onChange(updatedType, updatedValue);
              setUpdatedType("contains");
              setUpdatedValue("");
            }}
          >
            Add
          </Button>
        </Grid2>
      )}
    </Grid2>
  );
};

export default FilterItem;
