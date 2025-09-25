import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
const TableHeader = ({ defaultColumns }) => {
  return (
    <TableHead>
      <TableRow>
        {defaultColumns.map((col) => (
          <TableCell key={col}>{col}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
export default TableHeader;
