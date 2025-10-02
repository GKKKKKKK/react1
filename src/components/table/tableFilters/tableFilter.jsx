// tableFilter.jsx
import { Box, TextField } from "@mui/material";
import { useMemo, useEffect } from "react";
import DropdownFilter from "./dropdownFilter";
import { useTableCtx } from "../tableContext";

const TableFilter = ({ rows, setFilteredRows, setSearchStr }) => {
  // 🔸 Pull filter state from context (persists across views)
  const {
    descSearch, setDescSearch,
    platformFilter, setPlatformFilter,
    tag1Filter, setTag1Filter,
    tag2Filter, setTag2Filter,
    tag3Filter, setTag3Filter,
    trlFilter, setTrlFilter,
    yearFilter, setYearFilter,
    newEntryFilter, setNewEntryFilter,
  } = useTableCtx();

  const filterByColumn = (col) => {
    const set = new Set(rows.map((r) => r[col]).filter(Boolean));
    return ["All", ...Array.from(set)];
  };

  const platforms = useMemo(() => filterByColumn("Technology platform"), [rows]);
  const tag1s = useMemo(() => filterByColumn("Tag 1"), [rows]);
  const tag2s = useMemo(() => filterByColumn("Tag 2"), [rows]);
  const tag3s = useMemo(() => filterByColumn("Tag 3"), [rows]);
  const years  = useMemo(() => filterByColumn("Year of entry into the database"), [rows]);

  const trls = useMemo(
    () => ["All", ...Array.from({ length: 9 }, (_, i) => (i + 1).toString()), "Unknown", "Not applicable"],
    []
  );
  const newEntryOptions = ["All", "YES", "NO"];

  const matchesTRL = (row) => {
    const value = row["Anticipated TRL"]?.toLowerCase();
    if (trlFilter === "All") return true;
    if (trlFilter === "Unknown") return value === "unknown";
    if (trlFilter === "Not applicable") return value === "not applicable";
    if (!value) return false;

    const selected = parseInt(trlFilter, 10);
    const rangeMatch = value.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (rangeMatch) {
      const [min, max] = rangeMatch.slice(1).map(Number);
      return selected >= min && selected <= max;
    }
    return parseInt(value, 10) === selected;
  };

  const applyFilters = () =>
    rows.filter((row) => {
      const matchesPlatform = platformFilter === "All" || row["Technology platform"] === platformFilter;
      const matchesTag1 = tag1Filter === "All" || row["Tag 1"] === tag1Filter;
      const matchesTag2 = tag2Filter === "All" || row["Tag 2"] === tag2Filter;
      const matchesTag3 = tag3Filter === "All" || row["Tag 3"] === tag3Filter;
      const matchesYear = yearFilter === "All" || row["Year of entry into the database"] === yearFilter;
      const matchesDesc = !descSearch || row["Description of technology"]?.toLowerCase().includes(descSearch.toLowerCase());
      const matchesNewEntry = newEntryFilter === "All" || row["New entry"] === newEntryFilter;

      return (
        matchesPlatform &&
        matchesTag1 &&
        matchesTag2 &&
        matchesTag3 &&
        matchesYear &&
        matchesDesc &&
        matchesTRL(row) &&
        matchesNewEntry
      );
    });

  // 🔸 Re-apply filters whenever rows or any context filter changes
  useEffect(() => {
    setFilteredRows(applyFilters());
  }, [
    rows,
    descSearch,
    platformFilter,
    tag1Filter,
    tag2Filter,
    tag3Filter,
    trlFilter,
    yearFilter,
    newEntryFilter,
  ]);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2, maxWidth: "90vw", mx: "auto" }}>
      <TextField
        id="desc-search"
        label="Search Tech Description"
        variant="outlined"
        size="small"
        value={descSearch}
        onChange={(e) => {
          setSearchStr(e.target.value);  // for highlight in TableBody
          setDescSearch(e.target.value); // for filtering
        }}
        sx={{ minWidth: 240 }}
      />
      <DropdownFilter label="Technology Platform" filterValue={platformFilter} setFilterValue={setPlatformFilter} columnNames={platforms} />
      <DropdownFilter label="Tag 1" filterValue={tag1Filter} setFilterValue={setTag1Filter} columnNames={tag1s} />
      <DropdownFilter label="Tag 2" filterValue={tag2Filter} setFilterValue={setTag2Filter} columnNames={tag2s} />
      <DropdownFilter label="Tag 3" filterValue={tag3Filter} setFilterValue={setTag3Filter} columnNames={tag3s} />
      <DropdownFilter label="Anticipated TRL" filterValue={trlFilter} setFilterValue={setTrlFilter} columnNames={trls} />
      <DropdownFilter label="Year of Entry" filterValue={yearFilter} setFilterValue={setYearFilter} columnNames={years} />
      <DropdownFilter label="New entry" filterValue={newEntryFilter} setFilterValue={setNewEntryFilter} columnNames={newEntryOptions} />
    </Box>
  );
};

export default TableFilter;
