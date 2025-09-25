//ts-check
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
const CreateEntryDialog = ({
  createOpen,
  setCreateOpen,
  handleCreateChange,
  handleCreateSave,
  allColumns,
  createData,
}) => {
  return (
    <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
      <DialogTitle>Create New Entry</DialogTitle>
      <DialogContent>
        {allColumns
          ? allColumns
              .filter((col) => col !== "ID")
              .map((col) => (
                <TextField
                  key={col}
                  margin="dense"
                  label={col}
                  fullWidth
                  value={createData?.[col] || ""}
                  onChange={(e) => handleCreateChange(col, e.target.value)}
                  sx={{ mb: 1 }}
                />
              ))
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
