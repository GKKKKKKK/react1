// ts-check
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import {formatRow} from "../table/utils";
import { dataApiUrl } from "../../App";

// 🔑 Map UI labels → DB column names
const fieldMap = {
  "Technology platform": "technology_platform",
  "Insight name": "insight_name",
  "Company": "company",
  "Owner/named contact": "owner_contact",
  "Country": "country",
  "Tag 1": "tag1",
  "Tag 2": "tag2",
  "Tag 3": "tag3",
  "Anticipated TRL": "anticipated_trl",
  "Description of technology": "description",
  "Relevance to paper sacks": "relevance",
  "Environmental credentials": "environmental_credentials",
  "Current status": "current_status",
  "Potential challenges and points requiring further investigation": "challenges",
  "General contact details": "general_contact",
  "Email contact if available": "email",
  "Web pages": "web_pages",
  "Year of entry into the database": "year_of_entry",
  "Additional notes": "additional_notes",
  "Status update": "status_update",
  "Recommended": "recommended",
  "New entry": "new_entry",
  "Image 1": "s3key1",
  "Image 2": "s3key2",
  "Image 3": "s3key3",
};

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
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    try {
      // 🔑 Map UI labels → DB column names
      const mappedData = Object.fromEntries(
        Object.entries(editData).map(([label, value]) => [
          fieldMap[label] || label,
          value ?? "",
        ])
      );
      console.log("Edit payload being sent:", mappedData);

      const response = await fetch(`${dataApiUrl}/entries`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedData),
      });

      if (!response.ok) {
        alert("Failed to save changes!");
        return;
      }

      setEditOpen(false);

      // 🔄 Refresh table from backend
      fetch(`${dataApiUrl}/data`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = (data.rows || []).map(formatRow);
          setRows(formatted);
          if (showDetails && mappedData.insight_name) {
            const updated = formatted.find(
              (row) => row["Insight name"] === mappedData.insight_name
            );
            if (updated) setSelectedRowData(updated);
          }
        });
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Network or server error!");
    }
  };
  return (
    <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        {allColumns
          .filter((col) => col !== "ID")
          .map((col) => {
            if (col === "Recommended" || col === "New entry") {
              return (
                <TextField
                  key={col}
                  select
                  margin="dense"
                  label={col}
                  fullWidth
                  value={editData?.[col] || "YES"}
                  onChange={(e) => handleEditChange(col, e.target.value)}
                  sx={{ mb: 1 }}
                >
                  <MenuItem value="YES">YES</MenuItem>
                  <MenuItem value="NO">NO</MenuItem>
                </TextField>
              );
            }

            return (
              <TextField
                key={col}
                margin="dense"
                label={col}
                fullWidth
                value={editData?.[col] || ""}
                onChange={(e) => handleEditChange(col, e.target.value)}
                sx={{ mb: 1 }}
              />
            );
          })}
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
