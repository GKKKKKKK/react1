import { Routes, Route } from "react-router-dom";
import DetailsPage from "./components/DetailsPage";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Index from "./components/table/mainPage";
import MainBanner from "./components/banner/MainBanner";


//export const apiUrl = "http://localhost:3001";
export const dataApiUrl = "https://57zzacs2v9.execute-api.eu-west-2.amazonaws.com";
export const imageApiUrl = "https://y6h7ldgm6j.execute-api.eu-west-2.amazonaws.com";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              width: "100vw",
            }}
          >
            <MainBanner />
            <Typography variant="h2" align="center" gutterBottom>
              Demo
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                p: 4,
                boxShadow: 2,
                maxWidth: 500,
                width: "100%",
                mb: 4,
              }}
            >
              <Typography variant="body1" align="center">
                This is a paragraph that will contain the information about the
                website and how to use the table. Maybe replace with a button that brings
                up a dialog with more information for each category (see slides).
              </Typography>
            </Box>
            <Index />
          </Box>
        }
      />
      <Route path="/details/:id" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
