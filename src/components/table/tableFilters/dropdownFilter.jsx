import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const DropdownFilter = ({
  filterValue,
  setFilterValue,
  label,
  columnNames,
}) => {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="trl-filter-label">{label}</InputLabel>
      <Select
        labelId="trl-filter-label"
        value={filterValue}
        label={label}
        onChange={(e) => {
          setFilterValue(e.target.value);
          setPage(0);
        }}
      >
        {columnNames.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default DropdownFilter;
