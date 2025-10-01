import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { imageApiUrl } from "../../../App";

// 🔹 helper to upload an image file to S3 through your Lambda
async function uploadImageToApi(file) {
  const res = await fetch(`${imageApiUrl}/upload`, {
    method: "POST",
    headers: {
      "content-type": file.type,
      "x-filename": encodeURIComponent(file.name),
    },
    body: file,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json(); // { key, url }
  return data.key; // store key in DB
}

const CreateEntryDialog = ({
  createOpen,
  setCreateOpen,
  handleCreateChange,
  handleCreateSave,
  allColumns,
  createData,
}) => {
  // 🔹 file upload handler
  const handleFileChange = async (col, file) => {
    if (!file) return;
    try {
      const key = await uploadImageToApi(file);
      if (key) {
        handleCreateChange(col, key);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed!");
    }
  };

  return (
    <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
      <DialogTitle>Create New Entry</DialogTitle>
      <DialogContent>
        {allColumns
          ? allColumns
              .filter((col) => col !== "ID")
              .map((col) => {
                // Dropdown for "Recommended" and "New entry"
                if (col === "Recommended" || col === "New entry") {
                  return (
                    <TextField
                      key={col}
                      select
                      margin="dense"
                      label={col}
                      fullWidth
                      value={createData?.[col] || "YES"} // ✅ default YES
                      onChange={(e) =>
                        handleCreateChange(col, e.target.value)
                      }
                      sx={{ mb: 1 }}
                    >
                      <MenuItem value="YES">YES</MenuItem>
                      <MenuItem value="NO">NO</MenuItem>
                    </TextField>
                  );
                }

                // File upload for images
                if (col.toLowerCase().startsWith("image")) {
                  return (
                    <div key={col} style={{ marginBottom: "1rem" }}>
                      <label>{col}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(col, e.target.files[0])
                        }
                      />
                      {createData?.[col] && (
                        <p style={{ color: "green", fontSize: "0.8rem" }}>
                          Uploaded: {createData[col]}
                        </p>
                      )}
                    </div>
                  );
                }

                // Default text field
                return (
                  <TextField
                    key={col}
                    margin="dense"
                    label={col}
                    fullWidth
                    value={createData?.[col] || ""}
                    onChange={(e) =>
                      handleCreateChange(col, e.target.value)
                    }
                    sx={{ mb: 1 }}
                  />
                );
              })
          : ""}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
        <Button onClick={handleCreateSave} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEntryDialog;
