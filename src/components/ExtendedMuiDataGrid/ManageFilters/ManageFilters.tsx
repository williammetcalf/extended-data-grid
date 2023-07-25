import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import debounce from "lodash.debounce";
import { FC } from "react";
import FilterItem from "../FilterItem";
import Header from "./Header";
import { FieldFilter } from "../hooks/useFilters";

export interface ManageFiltersProps {
  filters?: FieldFilter;
  onChange: (filters: FieldFilter) => void;
}

const ManageFilters: FC<ManageFiltersProps> = (props) => {
  const { filters, onChange } = props;
  const filterCount = (filters && filters.filters.length) || 0;

  return (
    <StyledStack spacing={2}>
      <Header
        filterCount={filterCount}
        multiFilterOperator={filters?.multiFilterOperator}
        onOperatorChange={(operator) => {
          onChange({
            multiFilterOperator: operator,
            filters: filters?.filters || [],
          });
        }}
      />
      <Divider />
      {filterCount > 0 && (
        <Typography
          textAlign="center"
          variant="caption"
          style={{ opacity: 0.5 }}
        >
          Existing Filters
        </Typography>
      )}
      {filters?.filters.map((filter, idx) => (
        <FilterItem
          key={filter.id}
          type={filter.type}
          value={filter.value}
          autoSave
          onDelete={() => {
            onChange({
              ...filters,
              filters: filters.filters.filter((f) => f !== filter),
            });
          }}
          onChange={debounce((type, value) => {
            const updatedFilters = [...filters.filters];
            updatedFilters[idx] = { ...filter, type, value };
            onChange({ ...filters, filters: updatedFilters });
          }, 1000)}
        />
      ))}
      {filterCount > 0 && <Divider />}
      <Typography textAlign="center" variant="caption" style={{ opacity: 0.5 }}>
        New Filter
      </Typography>
      <FilterItem
        type="contains"
        value=""
        onChange={(type, value) => {
          onChange(
            filters
              ? {
                  multiFilterOperator: filters.multiFilterOperator,
                  filters: [
                    ...filters.filters,
                    { type, value, id: `${Math.random()}` },
                  ],
                }
              : {
                  multiFilterOperator: "or",
                  filters: [{ type, value, id: `${Math.random()}` }],
                }
          );
        }}
      />
    </StyledStack>
  );
};

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: 300,
}));

export default ManageFilters;
