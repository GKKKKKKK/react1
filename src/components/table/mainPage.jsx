// ts-check
import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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
  "Image 3"
];

function formatRow(row) {
  return {
    "ID": row.id, //db primary key
    "Technology platform": row.technology_platform,
    "Insight name": row.insight_name,
    "Tag 1": row.tag1,
    "Tag 2": row.tag2,
    "Tag 3": row.tag3,
    "Description of technology": row.description,
    "Anticipated TRL": row.anticipated_trl,
    "Company": row.company,
    "Owner/named contact": row.owner_contact,
    "Country": row.country,
    "Relevance to paper sacks": row.relevance,
    "Environmental credentials": row.environmental_credentials,
    "Current status": row.current_status,
    "Potential challenges and points requiring further investigation": row.challenges,
    "General contact details": row.general_contact,
    "Email contact if available": row.email,
    "Web pages": row.web_pages,
    "Year of entry into the database": row.year_of_entry,
    "Additional notes": row.additional_notes,
    "Status update": row.status_update,
    "Recommended": row.recommended,
    "New entry": row.new_entry,
    "Image 1": row.s3key1,
    "Image 2": row.s3key2,
    "Image 3": row.s3key3
  };
}


const defaultColumns = [
  "Insight name",
  "Technology platform",
  "Tag 1",
  "Tag 2",
  "Tag 3",
  "Description of technology",
  "Anticipated TRL"
];

function Index() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [pagedRows, setPagedRows] = useState([]);
  const [endIdx, setEndIdx] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [update, setUpdate] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchStr, setSearchStr] = useState("");

  // Helper to fetch table data
  const fetchTableData = () => {
    fetch(`${dataApiUrl}/data`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Raw API data:", data);
        const formatted = (data.rows || []).map(formatRow);
        console.log("Formatted rows:", formatted);
        setRows(formatted);
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // Filtering logic
  useEffect(() => {
    console.log("Updating filtered rows", update);
    setFilteredRows(rows);
  }, [rows]);

  // Reset page to 0 whenever any filter/search changes
  useEffect(() => {
    setPage(0);
  }, [update]);

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
      // Find the row in the full, unfiltered data by ID
      const row = rows.find((row) => row["ID"] === selectedRowId);
      setSelectedRowData(row);
      setShowDetails(true);
    }
  };
  const handleBackToTable = () => {
    setShowDetails(false);
  };

  // Filter for showing only new entries
  const [newEntryFilter, setNewEntryFilter] = useState(false);

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
          <CreateEntry />
          <FormControlLabel
            control={
              <Checkbox
                checked={newEntryFilter}
                onChange={(e) => setNewEntryFilter(e.target.checked)}
                color="primary"
              />
            }
            label="Show only New Entries"
            sx={{ mt: 2 }}
          />
          <TableFilter
            rows={rows}
            setFilteredRows={setFilteredRows}
            setUpdate={setUpdate}
            setSearchStr={setSearchStr}
          />
          <TableContainer
            component={Paper}
            sx={{ px: 8, maxWidth: "90vw", mx: "auto" }}
          >
            <Table size="small">
              <TableHeader defaultColumns={defaultColumns} />
              <CustomTableBody
                defaultColumns={defaultColumns}
                pagedRows={
                  newEntryFilter
                    ? pagedRows.filter((r) => r["New Entry"])
                    : pagedRows
                }
                selectedRowId={selectedRowId}
                handleRowSelect={handleRowSelect}
                searchStr={searchStr}
              />
            </Table>
          </TableContainer>
          <TablePagination
            page={page}
            filteredRows={filteredRows}
            endIdx={endIdx}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
          <Button
            variant="contained"
            sx={{ ml: 4 }}
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
        />
      )}
    </TableCtxProvider>
  );
}

export default Index;
