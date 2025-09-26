//ts-check
import { Button } from "@mui/material";
import { useState } from "react";
import CreateEntryDialog from "./createEntryDialog";
import { dataApiUrl } from "../../../App";
import { useTableCtx } from "../tableContext";
const CreateEntry = () => {
  const { allColumns, fetchTableData } =
    useTableCtx();
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState(() =>
    Object.fromEntries(
      allColumns.filter((col) => col !== "ID").map((col) => [col, ""])
    )
  );

  const handleCreateOpen = () => {
    setCreateData(
      Object.fromEntries(
        allColumns.filter((col) => col !== "ID").map((col) => [col, ""])
      )
    );
    setCreateOpen(true);
  };

  const handleCreateChange = (field, value) => {
    setCreateData((prev) => ({ ...prev, [field]: value }));
  };
  const handleCreateSave = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      if (!response.ok) {
        alert("Failed to create entry!");
        return;
      }
      setCreateOpen(false);
      fetchTableData();
    } catch (err) {
      alert("Network or server error!");
    }
  };
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleCreateOpen}>
        CREATE NEW ENTRY
      </Button>
      <CreateEntryDialog
        handleCreateChange={handleCreateChange}
        createData={createData}
        setCreateOpen={setCreateOpen}
        createOpen={createOpen}
        handleCreateSave={handleCreateSave}
        allColumns={allColumns}
      />
    </>
  );
};
export default CreateEntry;
