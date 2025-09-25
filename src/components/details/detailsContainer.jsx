import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import EditDetails from "./editDetails";
import { useState } from "react";
import { useTableCtx } from "../table/tableContext";
const DetailsContainer = ({
  selectedRowData,
  setRows,
  showDetails,
  setSelectedRowData,
  setShowDetails,
  setSelectedRowId,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(selectedRowData);
  const { allColumns } = useTableCtx();
  const handleEditEntry = () => {
    setEditData(selectedRowData);
  };
  const handleDeleteEntry = async () => {
    const insightName = encodeURIComponent(selectedRowData?.["Insight name"]);
    if (!insightName) return;
    await fetch(`apiUrl/api/entries/${insightName}`, { method: "DELETE" });
    // ...existing code (all hooks, handlers, and logic) should be inside this function...
    setShowDetails(false);
    setSelectedRowId(null);
    setSelectedRowData(null);
    // Optimistically remove from local state for instant UI update
    setRows((prevRows) =>
      prevRows.filter(
        (row) => row["Insight name"] !== selectedRowData["Insight name"]
      )
    );
    setTimeout(() => {
      fetchTableData();
    }, 300);
  };
  return (
    <Box sx={{ maxWidth: "900px", mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => setShowDetails(false)}>
          Back to Table
        </Button>
        <Button variant="outlined">Create PDF</Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setEditOpen((prev) => !prev);
            handleEditEntry();
          }}
        >
          Edit Entry
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteEntry}>
          Delete Entry
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedRowData?.["New Entry"] || false}
              onChange={(e) => {
                setSelectedRowData({
                  ...selectedRowData,
                  ["New Entry"]: e.target.checked,
                });
              }}
              color="primary"
            />
          }
          label="New Entry"
          sx={{ ml: 2 }}
        />
      </Box>
      <Paper sx={{ p: 3 }}>
        <h2>
          {selectedRowData?.["Insight name"] ||
            selectedRowData?.ID ||
            "Details"}
        </h2>
        {selectedRowData ? (
          <Table size="small">
            <TableBody>
              {allColumns.map((col) => (
                <TableRow key={col}>
                  <TableCell sx={{ fontWeight: "bold", width: 220 }}>
                    {col}
                  </TableCell>
                  <TableCell>{selectedRowData[col] || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>No details found.</div>
        )}
      </Paper>
      {/* Edit Dialog */}
      <EditDetails
        allColumns={allColumns}
        setSelectedRowData={setSelectedRowData}
        setRows={setRows}
        showDetails={showDetails}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        editData={editData}
        setEditData={setEditData}
      ></EditDetails>
    </Box>
  );
};
export default DetailsContainer;
