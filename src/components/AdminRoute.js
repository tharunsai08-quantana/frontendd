import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const AdminRoute = ({ children }) => {
  const role = JSON.parse(localStorage.getItem("role"));
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      const timer = setTimeout(() => setRedirect(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [role]);

  if (role !== "admin") {
    if (redirect) return <Navigate to="/" replace />;

    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "#fff3e0",
          p: 3,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" maxWidth="400px">
          Redirecting to the home page...
        </Typography>
      </Box>
    );
  }

  return children;
};

export default AdminRoute;
