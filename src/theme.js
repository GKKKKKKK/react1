// src/theme.js
import { createTheme } from "@mui/material/styles";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#161922",
      paper: "#1a1d27",
    },
    table: {
      background: "#10131a",
      secondary: "#181e29",
    },
    primary: {
      main: "#25406a",
      light: "#3b5c8c",
      dark: "#182a45",
      contrastText: "#fff",
    },
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    fontSize: 15,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: "capitalize",
      fontWeight: 600,
      textShadow:
        "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: "#23272f",
          color: "#fff",
        },
        input: {
          "&::placeholder": {
            color: "#b0b0b0",
            opacity: 1,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#D64E6A",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "0.95rem",
          letterSpacing: "0.02em",
          borderBottom: "2px solid #180242ff",
        },
        body: {
          borderBottom: "1px solid #180242ff",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          color: "#F4F4F4",
          "&:nth-of-type(odd)": {
            backgroundColor: "#0F141A",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#101622",
          },
          "&:hover": {
            backgroundColor: "#1C2028 !important",
          },
        },
      },
    },
  },
});
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0D47A1", // deep blue
      contrastText: "#ffffff",
    },
    background: {
      default: "#c45a5aff",
      paper: "#ffffff",
    },
  },

  components: {
    // ✅ Table header (force stronger style override)
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#0D47A1 ",
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

export default darkTheme;
