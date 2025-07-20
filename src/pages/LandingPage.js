import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#e0f7fa",
        textAlign: "center",
        p: 4,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Welcome to Quantana!
      </Typography>
      <Typography variant="h6" color="textSecondary" mb={4}>
        Your smart business analytics dashboard.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoToLogin}>
        Get Started
      </Button>
    </Box>
  );
};

export default LandingPage;
