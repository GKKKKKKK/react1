// @ts-check
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useMemo, useState, useEffect, useRef } from "react";
import DropdownFilter from "./dropdownFilter";

const TableFilter = ({ rows, setFilteredRows, setUpdate, setSearchStr }) => {
  const filterRows = () => {
    const trlFilterer = (row) => {
      const trlValue = row["Anticipated TRL"];
      const selected = parseInt(trlFilter, 10);

      if (!trlValue || isNaN(selected)) return false;

      const rangeMatch = trlValue.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (rangeMatch) {
        const [min, max] = rangeMatch.slice(1).map(Number);
        return selected >= min && selected <= max;
      }

      const trl = parseInt(trlValue, 10);
      return trl === selected;
    };

    return rows
      .map((row, idx) => ({ ...row, ID: idx + 1 }))
      .filter((row) => {
        const matchesPlatform =
          platformFilter === "All" ||
          row["Technology platform"] === platformFilter;

        const matchesTag1 = tag1Filter === "All" || row["Tag 1"] === tag1Filter;
        const matchesTag2 = tag2Filter === "All" || row["Tag 2"] === tag2Filter;
        const matchesTag3 = tag3Filter === "All" || row["Tag 3"] === tag3Filter;
        const matchesTRL =
          trlFilter === "All" ||
          (trlFilter === "Unknown" &&
            row["Anticipated TRL"]?.toLowerCase() === "unknown") ||
          (trlFilter === "Not applicable" &&
            row["Anticipated TRL"]?.toLowerCase() === "not applicable") ||
          trlFilterer(row);
        const matchesDesc =
          !descSearch ||
          row["Description of technology"]
            ?.toLowerCase()
            .includes(descSearch.toLowerCase());
        return (
          matchesPlatform &&
          matchesTag1 &&
          matchesTag2 &&
          matchesTag3 &&
          matchesTRL &&
          matchesDesc
        );
      });
  };

  const filterByColumn = (col) => {
    const set = new Set(rows.map((r) => r[col]).filter(Boolean));
    return ["All", ...Array.from(set)];
  };
  const platforms = useMemo(() => {
    return filterByColumn("Technology platform");
  }, [rows]);
  const tag1s = useMemo(() => {
    return filterByColumn("Tag 1");
  }, [rows]);
  const tag2s = useMemo(() => {
    return filterByColumn("Tag 2");
  }, [rows]);
  const tag3s = useMemo(() => {
    return filterByColumn("Tag 3");
  }, [rows]);
  // Anticipated TRL filter: options 1-9 as numbers, plus 'All', 'Unknown', 'Not applicable'
  const trls = useMemo(() => {
    return [
      "All",
      ...Array.from({ length: 9 }, (_, i) => (i + 1).toString()),
      "Unknown",
      "Not applicable",
    ];
  }, []);
  const [descSearch, setDescSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [tag1Filter, setTag1Filter] = useState("All");
  const [tag2Filter, setTag2Filter] = useState("All");
  const [tag3Filter, setTag3Filter] = useState("All");
  const [trlFilter, setTrlFilter] = useState("All");

  useEffect(() => {
    console.log("Applying filters:", {
      descSearch,
      platformFilter,
    });
    console.log;
    setFilteredRows(filterRows());
    setUpdate((prev) => !prev); // Trigger re-render in parent
  }, [
    platformFilter,
    tag1Filter,
    tag2Filter,
    tag3Filter,
    trlFilter,
    descSearch,
  ]);
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        mb: 2,
        maxWidth: "90vw",
        mx: "auto",
      }}
    >
      <TextField
        id="desc-search"
        label="Search Tech Description"
        variant="outlined"
        size="small"
        value={descSearch}
        onChange={(e) => {
          setSearchStr(e.target.value);
          return setDescSearch(e.target.value);
        }}
        sx={{ minWidth: 240 }}
      />
      <DropdownFilter
        filterValue={platformFilter}
        setFilterValue={setPlatformFilter}
        label="Technology Platform"
        columnNames={platforms}
      />
      <DropdownFilter
        filterValue={tag1Filter}
        setFilterValue={setTag1Filter}
        label="Tag 1"
        columnNames={tag1s}
      />
      <DropdownFilter
        filterValue={tag2Filter}
        setFilterValue={setTag2Filter}
        label="Tag 2"
        columnNames={tag2s}
      />
      <DropdownFilter
        filterValue={tag3Filter}
        setFilterValue={setTag3Filter}
        label="Tag 3"
        columnNames={tag3s}
      />
      <DropdownFilter
        filterValue={trlFilter}
        setFilterValue={setTrlFilter}
        label="Anticipated TRL"
        columnNames={trls}
      />
    </Box>
  );
};
export default TableFilter;
