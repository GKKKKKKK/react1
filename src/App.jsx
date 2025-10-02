import { Routes, Route } from "react-router-dom";
import DetailsPage from "./components/DetailsPage";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Index from "./components/table/mainPage";
import MainBanner from "./components/banner/MainBanner";
import AboutDB from "./components/aboutDB/aboutDB";


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
            <AboutDB />
            <Index />
          </Box>
        }
      />
      <Route path="/details/:id" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
