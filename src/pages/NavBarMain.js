import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, Box } from '@mui/material';

const NavBarMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem('token');

  const afterLoginTabs = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Events', path: '/events_dashboard' },
    { label: 'FAQ', path: '/faq' },
  ];

  const getTabIndex = () => {
    const idx = afterLoginTabs.findIndex(tab => location.pathname.startsWith(tab.path));
    return idx === -1 ? false : idx;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Side: Logo */}
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          Event Management
        </Typography>

        {/* Right Side: Tabs + Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoggedIn && (
            <Tabs
              value={getTabIndex()}
              textColor="inherit"
              indicatorColor="secondary"
              aria-label="navigation tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  bgcolor: 'secondary.main',
                },
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                },
              }}
            >
              {afterLoginTabs.map((tab) => (
                <Tab
                  key={tab.path}
                  label={tab.label}
                  onClick={() => navigate(tab.path)}
                />
              ))}
            </Tabs>
          )}

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarMain;
