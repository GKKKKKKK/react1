import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {dataApiUrl } from "../App";
// For PDF download
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const allColumns = [
  "Number",
  "Technology platform",
  "Insight name",
  "Company",
  "Owner/named contact",
  "Country",
  "Tag 1",
  "Tag 2",
  "Tag 3",
  "Anticipated TRL",
  "Description of technology",
  "Relevance to paper sacks",
  "Environmental credentials",
  "Current status",
  "Potential challenges and points requiring further investigation",
  "General contact details",
  "Email contact if available",
  "Web pages",
  "Year of entry into the database",
  "Additional notes",
  "Status update",
  "Recommended",
];

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState(null);

  useEffect(() => {
    fetch(`${dataApiUrlapiUrl}/data`)
      .then((res) => res.json())
      .then((data) => setRow(data[parseInt(id, 10) - 1]));
  }, [id]);

  const handleDownloadPDF = async () => {
    const input = document.getElementById("details-pdf-content");
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save(`${row["Insight name"] || "details"}.pdf`);
  };

  if (!row) return <div>Loading...</div>;

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2, mb: 2 }}>
        {row["Insight name"]}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          Download as PDF
        </Button>
      </Box>
      <div id="details-pdf-content">
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "80vw", mx: "auto", mt: 4 }}
        >
          <Table size="small">
            <TableBody>
              {allColumns.map((col) => (
                <TableRow key={col}>
                  <TableCell sx={{ fontWeight: "bold", width: 200 }}>
                    {col}
                  </TableCell>
                  <TableCell>{row[col] || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
