import { Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const TableHeader = ({ defaultColumns }) => {
  const columnWidths = {
    // "Insight name": { xs: "120px", md: "200px" },
    // "Technology platform": { xs: "120px", md: "150px" },
    // "Description of technology": { xs: "250px", md: "400px" }, // wider on desktop
    // "Anticipated TRL": { xs: "60px", md: "120px" },
    // "Year of entry into the database": { xs: "120px", md: "150px" },
    // "Tag 1": { xs: "80px", md: "100px" },
    // "Tag 2": { xs: "80px", md: "100px" },
    // "Tag 3": { xs: "80px", md: "100px" },
    // Details: { xs: "60px", md: "80px" },
  };

  const displayNames = {
    "Year of entry into the database": "Year of entry", // shorter label
    "Technology platform": "technology",
    "Insight name": "insight",
    "Description of technology": "description",
  };

  return (
    <TableHead>
      <TableRow>
        {defaultColumns.map((col) => (
          <TableCell
            key={col}
            sx={{
              width: columnWidths[col] || "auto",
              whiteSpace: "nowrap",
              fontWeight: "bold",
              overflow: "visible",
            }}
          >
            <Typography textTransform={"capitalize"} >
              {displayNames[col] || col}
            </Typography>
          </TableCell>
        ))}

        {/* ✅ Add one Details column at the end */}
        <TableCell
          key="Details"
          sx={{
            // width: columnWidths["Details"].md,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Details
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
