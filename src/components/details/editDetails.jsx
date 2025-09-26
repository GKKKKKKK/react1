import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { dataApiUrl } from "../../App";
const EditDetails = ({
  showDetails,
  allColumns,
  setRows,
  setSelectedRowData,
  editOpen,
  setEditOpen,
  editData,
  setEditData,
}) => {
  const [originalInsightName, setOriginalInsightName] = useState(null);
  const handleEditEntry = () => {
    setEditData(selectedRowData);
    setOriginalInsightName(selectedRowData["Insight name"]);
    setEditOpen(true);
  };
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    const insightName = encodeURIComponent(
      originalInsightName || editData["Insight name"]
    );
    try {
      const response = await fetch(`${apiUrl}/api/entries/${insightName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        alert("Failed to save changes!");
        return;
      }
      setEditOpen(false);
      setOriginalInsightName(null);
      // Fetch new data, then update details if needed
      fetch(`${apiUrl}/api/data`)
        .then((res) => res.json())
        .then((data) => {
          const withIds = data.map((row) => ({
            ...row,
            uniqueId: row.uniqueId || row["Insight name"] + Math.random(),
          }));
          setRows(withIds);
          if (showDetails && originalInsightName) {
            const updated = withIds.find(
              (row) => row["Insight name"] === originalInsightName
            );
            if (updated) setSelectedRowData(updated);
          }
        });
    } catch (err) {
      alert("Network or server error!", err);
    }
  };
  return (
    <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        {allColumns
          .filter((col) => col !== "ID")
          .map((col) => (
            <TextField
              key={col}
              margin="dense"
              label={col}
              fullWidth
              value={editData?.[col] || ""}
              onChange={(e) => handleEditChange(col, e.target.value)}
              sx={{ mb: 1 }}
            />
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditOpen(false)}>Cancel</Button>
        <Button onClick={handleEditSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditDetails;
