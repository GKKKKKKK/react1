// src/components/details/DeleteEntry.jsx
import { Button } from "@mui/material";
import { dataApiUrl } from "../../App";

const DeleteEntry = ({
  selectedRowData,
  setShowDetails,
  setSelectedRowId,
  setSelectedRowData,
  fetchTableData,
}) => {
  const handleDelete = async () => {
    if (!selectedRowData?.ID) {
      alert("No entry selected to delete");
      return;
    }
    const payload = { ID: selectedRowData.ID };
    console.log("Delete payload:", payload);
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`${dataApiUrl}/entries`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert("Failed to delete entry!");
        return;
      }

      // Reset UI state after successful deletion
      setShowDetails(false);
      setSelectedRowId(null);
      setSelectedRowData(null);

      // Refresh data from DB
      fetchTableData();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Network or server error while deleting!");
    }
  };

  return (
    <Button variant="outlined" color="error" onClick={handleDelete}>
      Delete Entry
    </Button>
  );
};

export default DeleteEntry;
