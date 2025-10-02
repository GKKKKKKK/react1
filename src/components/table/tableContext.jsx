// tableContext.jsx
import { createContext, useContext, useState } from "react";

const TableCtx = createContext(null);

/**
 * Provider now creates and owns filter state so it persists
 * across Table <-> Details view toggles.
 *
 * You can still pass other values via `value` (fetchTableData, rows, etc.).
 */
const TableCtxProvider = ({ children, value = {} }) => {
  // 🔸 Persisted filter state
  const [descSearch, setDescSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [tag1Filter, setTag1Filter] = useState("All");
  const [tag2Filter, setTag2Filter] = useState("All");
  const [tag3Filter, setTag3Filter] = useState("All");
  const [trlFilter, setTrlFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [newEntryFilter, setNewEntryFilter] = useState("All");

  const resetFilters = () => {
    setDescSearch("");
    setPlatformFilter("All");
    setTag1Filter("All");
    setTag2Filter("All");
    setTag3Filter("All");
    setTrlFilter("All");
    setYearFilter("All");
    setNewEntryFilter("All");
  };

  const ctx = {
    ...value,
    // expose filter state + setters
    descSearch, setDescSearch,
    platformFilter, setPlatformFilter,
    tag1Filter, setTag1Filter,
    tag2Filter, setTag2Filter,
    tag3Filter, setTag3Filter,
    trlFilter, setTrlFilter,
    yearFilter, setYearFilter,
    newEntryFilter, setNewEntryFilter,
    resetFilters,
  };

  return <TableCtx.Provider value={ctx}>{children}</TableCtx.Provider>;
};

export const useTableCtx = () => {
  const context = useContext(TableCtx);
  if (!context) {
    throw new Error("useTable must be used within a tableProvider");
  }
  return context;
};

export default TableCtxProvider;
