import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import { Button, Table, Paper } from "@mui/material";
import { dataApiUrl } from "../../App";
import TableHeader from "./tableHeader/tableHeader";
import DetailsContainer from "../details/detailsContainer";
import CustomTableBody from "./tableBody";
import TablePagination from "./tableFooter";
import TableFilter from "./tableFilters/tableFilter";
import TableCtxProvider from "./tableContext";
import CreateEntry from "./createEntry/createEntry";
import { formatRow, fetchWithRetry } from "../table/utils";

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
  "Year of entry into the database",
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
    fetchWithRetry(`${dataApiUrl}/data`, {}, 3, 2000)
      .then((data) => {
        const formatted = (data.rows || []).map(formatRow);
        setRows(formatted);
      })
      .catch((err) => {
        console.error("Error fetching data after retries:", err);
      });
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

  const handleDetailsClick = (rowParam) => {
    const rowToShow = rowParam || rows.find((r) => r["ID"] === selectedRowId);
    if (rowToShow) {
      setSelectedRowId(rowToShow["ID"]);
      setSelectedRowData(rowToShow);
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
            alignItems: "stretch",
            mb: 2,
            mx: "auto",
            padding: "20px",
          }}
        >
          {/* Create New Entry Button */}
          <Box sx={{ mb: 3 }} display={"flex"} justifyContent={"center"}>
            <CreateEntry />
          </Box>

          {/* Filters */}
          <TableFilter
            rows={rows}
            setFilteredRows={setFilteredRows}
            setSearchStr={setSearchStr}
          />
          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              minWidth: "200px",
              alignItems: "center",
              height: "56px",
              pr: 2,
              mb: 2,
            }}
          >
            <TablePagination
              page={page}
              filteredRows={filteredRows}
              endIdx={endIdx}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
            />
          </Box>
          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              overflowX: "auto",
              borderRadius: 2,
              px: { xs: 1, sm: 2 },
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <Table
                size="small"
                sx={{
                  width: "100%",
                  tableLayout: "auto",
                  borderCollapse: "collapse",
                }}
              >
                <TableHeader defaultColumns={defaultColumns} />
                <CustomTableBody
                  defaultColumns={defaultColumns}
                  pagedRows={pagedRows}
                  selectedRowId={selectedRowId}
                  handleRowSelect={handleRowSelect}
                  searchStr={searchStr}
                  handleDetailsClick={handleDetailsClick}
                />
              </Table>
            </Box>
          </TableContainer>
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
