import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const TablePagination = ({
  page,
  rowsPerPage,
  filteredRows,
  endIdx,
  setPage,
  setRowsPerPage,
}) => {
  const handlePageChange = (key) => {
    if (key === "next") {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <IconButton
        onClick={() => handlePageChange("prev")}
        disabled={page === 0}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ mx: 2 }}>
        Page {page + 1} of{" "}
        {Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))}
      </Box>
      <IconButton
        onClick={() => handlePageChange("next")}
        disabled={endIdx >= filteredRows.length}
      >
        <ArrowForwardIcon />
      </IconButton>
      <FormControl size="small" sx={{ ml: 4, minWidth: 120 }}>
        <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
        <Select
          labelId="rows-per-page-label"
          value={rowsPerPage}
          label="Rows per page"
          onChange={handleRowsPerPageChange}
        >
          {[5, 10].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
export default TablePagination;
