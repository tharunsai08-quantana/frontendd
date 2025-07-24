import React from "react";
import { Typography, Button, Box, Grid, Paper } from "@mui/material";
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
        background: "linear-gradient(to right, #e0f7fa, #80deea)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
          bgcolor: "#ffffffee",
          borderRadius: 4,
        }}
      >
        <Typography variant="h3" gutterBottom color="primary">
          Welcome, {user.name || "User"}!
        </Typography>
        <Typography variant="h6" mb={4}>
          Manage your events efficiently with our dashboard.
        </Typography>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          mb={2}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/events_dashboard")}
            >
              View Events
            </Button>
          </Grid>

         
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
