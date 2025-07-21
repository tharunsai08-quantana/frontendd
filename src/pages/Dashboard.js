import React from "react";
import { Typography, Button, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NoToken from "../components/NoToken";

const Dashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (!token) {
    return <NoToken onLoginClick={handleLoginRedirect} />;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 4,
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome, {user.name || "User"}!
      </Typography>
      <Typography variant="h6" mb={4}>
        Manage your events efficiently with our dashboard.
      </Typography>

      <Grid container spacing={2} justifyContent="center" mb={4}>

        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/events")}
          >
            View  Events
          </Button>
        </Grid>
       
      </Grid>


    </Box>
  );
};

export default Dashboard;
