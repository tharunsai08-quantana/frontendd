import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        padding: 4,
      }}
    >
      <Typography variant="h3" fontWeight={600} gutterBottom color="#002060">
        Welcome Back!
      </Typography>

      <Typography variant="h6" color="textSecondary" gutterBottom>
        Choose where you'd like to go next:
      </Typography>

      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/home')}
        >
          Go to Home
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/events')}
        >
          View Events
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/faq')}
        >
          FAQ
        </Button>
      </Stack>
    </Box>
  );
};

export default UserLandingPage;
