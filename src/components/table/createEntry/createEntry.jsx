// ts-check
import { Button } from "@mui/material";
import { useState } from "react";
import CreateEntryDialog from "./createEntryDialog";
import { dataApiUrl } from "../../../App";
import { useTableCtx } from "../tableContext";

// 🔑 NEW: Map UI labels -> DB column names
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

const CreateEntry = () => {
  const { allColumns, fetchTableData } = useTableCtx();
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState(() =>
    Object.fromEntries(allColumns.filter((col) => col !== "ID").map((col) => [col, ""]))
  );

  const handleCreateOpen = () => {
    setCreateData(
      Object.fromEntries(allColumns.filter((col) => col !== "ID").map((col) => [col, ""]))
    );
    setCreateOpen(true);
  };

  const handleCreateChange = (field, value) => {
    setCreateData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSave = async () => {
    try {
      // 🔑 NEW: Convert UI labels to DB column names before sending
      const mappedData = Object.fromEntries(
        Object.entries(createData).map(([label, value]) => [
          fieldMap[label] || label,
          value || "", // ✅ ensure empty string instead of null
        ])
      );

      console.log("Payload being sent:", mappedData); // 🔍 debug

      const response = await fetch(`${dataApiUrl}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedData),
      });

      if (!response.ok) {
        alert("Failed to create entry!");
        return;
      }

      setCreateOpen(false);
      fetchTableData();
    } catch (err) {
      console.error("Error creating entry:", err);
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
