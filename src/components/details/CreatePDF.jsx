// src/components/details/CreatePDF.jsx
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// helper: clean up weird hidden characters
const clean = (str) => (str || "").replace(/[\u200B-\u200D\uFEFF]|_x000B_/g, "");

const CreatePDF = ({ selectedRowData, allColumns }) => {
  const handleCreatePDF = () => {
    const doc = new jsPDF();

    // Title = Insight Name
    const title = clean(selectedRowData["Insight name"] || "Entry Details");
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFont("helvetica");

    // Build table body
    const body = allColumns
      .filter((col) => col !== "ID" && !col.startsWith("Image")) // skip ID + image keys
      .map((col) => [col, clean(selectedRowData[col]) || ""]);

    autoTable(doc, {
      head: [["Field", "Value"]],
      body,
      startY: 30,
      styles: {
        fontSize: 10,
        font: "helvetica",
        fontStyle: "normal",
        cellWidth: "wrap",
        cellPadding: 3,
        valign: "top",
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 60 },  // field column fixed
        1: { cellWidth: 120 }, // value column wraps nicely
      },
      //didParseCell: (data) => {
      //  if (data.cell.raw && data.cell.raw.length > 200) {
      //     data.cell.styles.fontSize = 8; // shrink text for long cells
      //  }
      //},
      margin: { top: 20, left: 14, right: 14 },

      rowPageBreak: "avoid",
    });

    doc.save(`${title}.pdf`);
  };

  return (
    <Button variant="outlined" onClick={handleCreatePDF}>
      Create PDF
    </Button>
  );
};

export default CreatePDF;
