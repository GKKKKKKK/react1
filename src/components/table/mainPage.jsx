// ts-check
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { dataApiUrl } from "../../App";
import TableHeader from "./tableHeader/tableHeader";
import DetailsContainer from "../details/detailsContainer";
import CustomTableBody from "./tableBody";
import TablePagination from "./tableFooter";
import TableFilter from "./tableFilters/tableFilter";
import { Button, Table } from "@mui/material";
import TableCtxProvider from "./tableContext";
import CreateEntry from "./createEntry/createEntry";
import { formatRow } from "../table/utils";

const allColumns = [
  "ID",
  "Technology platform",
  "Insight name",
  "Company",
  "Owner/named contact",
  "Country",
  "Tag 1",
  "Tag 2",
  "Tag 3",
  "Anticipated TRL",
  "Description of technology",
  "Relevance to paper sacks",
  "Environmental credentials",
  "Current status",
  "Potential challenges and points requiring further investigation",
  "General contact details",
  "Email contact if available",
  "Web pages",
  "Year of entry into the database",
  "Additional notes",
  "Status update",
  "Recommended",
  "New entry",
  "Image 1",
  "Image 2",
  "Image 3",
];

const defaultColumns = [
  "Insight name",
  "Technology platform",
  "Tag 1",
  "Tag 2",
  "Tag 3",
  "Description of technology",
  "Anticipated TRL",
];

function Index() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [pagedRows, setPagedRows] = useState([]);
  const [endIdx, setEndIdx] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchStr, setSearchStr] = useState("");

  // Fetch table data
  const fetchTableData = () => {
    fetch(`${dataApiUrl}/data`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.rows || []).map(formatRow);
        setRows(formatted);
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // When rows change, reset filteredRows
  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filteredRows]);

  // Pagination logic
  useEffect(() => {
    const startIdx = page * rowsPerPage;
    setEndIdx(startIdx + rowsPerPage);
    setPagedRows(filteredRows.slice(startIdx, startIdx + rowsPerPage));
  }, [filteredRows, page, rowsPerPage]);

  // Handlers
  const handleRowSelect = (id) => {
    setSelectedRowId(id);
  };

  const handleDetailsClick = () => {
    if (selectedRowId) {
      const row = rows.find((row) => row["ID"] === selectedRowId);
      setSelectedRowData(row);
      setShowDetails(true);
    }
  };

  const handleBackToTable = () => {
    setShowDetails(false);
  };

  const loading = rows.length === 0;

  return (
    <TableCtxProvider
      value={{
        handleBackToTable,
        fetchTableData,
        setRows,
        selectedRowData,
        rows,
        allColumns,
      }}
    >
      {!showDetails ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
            maxWidth: "90vw",
            mx: "auto",
          }}
        >
          {/* Create New Entry Button */}
          <Box sx={{ mb: 3 }}>
            <CreateEntry />
          </Box>

          {/* Filters */}
          <TableFilter
            rows={rows}
            setFilteredRows={setFilteredRows}
            setSearchStr={setSearchStr}
          />

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ px: 8, maxWidth: "90vw", mx: "auto" }}
          >
            <Table size="small">
              <TableHeader defaultColumns={defaultColumns} />
              <CustomTableBody
                defaultColumns={defaultColumns}
                pagedRows={pagedRows}
                selectedRowId={selectedRowId}
                handleRowSelect={handleRowSelect}
                searchStr={searchStr}
              />
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            page={page}
            filteredRows={filteredRows}
            endIdx={endIdx}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />

          {/* Details Button */}
          <Button
            variant="contained"
            sx={{ ml: 4, mt: 2 }}
            disabled={loading || !selectedRowId}
            onClick={handleDetailsClick}
          >
            Show Details
          </Button>
        </Box>
      ) : (
        <DetailsContainer
          setShowDetails={setShowDetails}
          setSelectedRowId={setSelectedRowId}
          showDetails={showDetails}
          setSelectedRowData={setSelectedRowData}
          selectedRowData={selectedRowData}
          selectedRowId={selectedRowId}
          setRows={setRows}
          fetchTableData={fetchTableData}
        />
      )}
    </TableCtxProvider>
  );
}

export default Index;
