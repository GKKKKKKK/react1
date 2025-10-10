// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0D47A1", // deep blue
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },

  components: {
    // ✅ Table header (force stronger style override)
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#0D47A1 !important", // ensure override
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#0D47A1 !important",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "0.95rem",
          letterSpacing: "0.02em",
          borderBottom: "2px solid #0A357A",
        },
        body: {
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#EAF3FC",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#ffffff",
          },
          "&:hover": {
            backgroundColor: "#D2E3FA",
          },
        },
      },
    },
  },

  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
});

export default theme;
