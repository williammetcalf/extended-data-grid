import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { FC } from "react";

export interface HeaderProps {
  filterCount: number;
  multiFilterOperator?: "or" | "and";
  onOperatorChange: (operator: "or" | "and") => void;
}

const Header: FC<HeaderProps> = (props) => {
  const { filterCount, multiFilterOperator = "or", onOperatorChange } = props;

  return (
    <>
      <Box
        display="flex"
        justifyContent={filterCount > 1 ? "space-between" : "center"}
        alignItems="center"
      >
        <Typography variant="h6">Filters</Typography>
        {filterCount > 1 && (
          <FormControl size="small" style={{ width: "10em" }}>
            <InputLabel>Filter Strategy</InputLabel>
            <Select
              variant="outlined"
              fullWidth
              label="Filter Strategy"
              value={multiFilterOperator}
              onChange={(e) => onOperatorChange(e.target.value as any)}
            >
              <MenuItem value="or">Match Single</MenuItem>
              <MenuItem value="and">Match All</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
    </>
  );
};

export default Header;
