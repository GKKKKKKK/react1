

import { Routes, Route } from 'react-router-dom';
import DetailsPage from './components/DetailsPage';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MyTable1 from './components/MyTable1';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              width: '100vw',
            }}
          >
            <Typography variant="h2" align="center" gutterBottom>
              Demo
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                p: 4,
                boxShadow: 2,
                maxWidth: 500,
                width: '100%',
                mb: 4,
              }}
            >
              <Typography variant="body1" align="center">
                This is a paragraph that will contain the information about the website and how to use the table
              </Typography>
            </Box>
            <MyTable1 />
          </Box>
        }
      />
      <Route path="/details/:id" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
