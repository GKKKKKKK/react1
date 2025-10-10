import { Routes, Route } from "react-router-dom";
import DetailsPage from "./components/DetailsPage";
import Box from "@mui/material/Box";
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
              alignItems: "stretch",  // let children fill width
              gap: 3,
              mb: 4,
              width: "100%",
          //  maxWidth: { xs: "98%", sm: "95%", md: "90%", lg: "80%" },
              mx: "auto",
              px: { xs: 1, sm: 2, md: 4 },
              boxSizing: "border-box",
            }}
          >
            <MainBanner />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >

              <AboutDB />
              
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
