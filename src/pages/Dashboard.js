import React from "react";
import { Typography, Button, Box } from "@mui/material";
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" mb={2}>
        Welcome, {user.name || "User"}!
      </Typography>
      <Typography variant="body1" mb={4}>
        This is your dashboard.
      </Typography>
      <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;
