// src/App.js (or App.tsx if you're using TypeScript)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Box from '@mui/material/Box';
import NavBarMain from './pages/NavBarMain';

const App = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Router>
        <NavBarMain />
        <Box
          sx={{
            flex: 1, 
          }}
        >
          <AppRouter />
        </Box>
      </Router>
    </Box>
  );
};

export default App;