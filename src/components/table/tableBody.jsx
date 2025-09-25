import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
const CustomTableBody = ({
  pagedRows,
  handleRowSelect,
  selectedRowId,
  defaultColumns,
  searchStr
}) => {
  return (
    <TableBody>
      {pagedRows.map((row) => (
        <TableRow
          hover
          key={row.uniqueId}
          selected={selectedRowId === row.uniqueId}
          onClick={() => handleRowSelect(row.uniqueId)}
          sx={(theme) => ({
            cursor: "pointer",
            transition: "background-color 0.2s",
            backgroundColor:
              selectedRowId === row.uniqueId
                ? theme.palette.primary.main
                : undefined,
            color:
              selectedRowId === row.uniqueId
                ? theme.palette.primary.contrastText
                : undefined,
          })}
        >
          {defaultColumns.map((col) =>
            col === "Description of technology" ? (
              <TableCell className={col} key={col}>
                {row[col] ? highlightText(row[col], searchStr) : ""}
              </TableCell>
            ) : (
              <TableCell className={col} key={col}>
                {row[col] || ""}
              </TableCell>
            )
          )}
        </TableRow>
      ))}
    </TableBody>
  );
};
const highlightText = (text, searchStr) => {
  if (!searchStr) return text;
  const regex = new RegExp(`(${searchStr})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: "yellow" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};
export default CustomTableBody;
