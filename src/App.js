import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Box from '@mui/material/Box';
import NavBarMain from './pages/NavBarMain';
import Chatbot from './chatBot/Chatbot';
import FormQueue from './advanced/FormQueue';


const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
        <Box sx={{ flex: 1 }}>
          {/* <AppRouter />
          <Chatbot /> */}
          <FormQueue />
        </Box>
      </Router>
    </Box>
  );
};

export default App;
