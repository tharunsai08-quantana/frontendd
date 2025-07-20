// src/components/NoToken.js
import React from "react";
import { Typography, Button, Box, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const NoToken = ({ onLoginClick }) => (
  <Box
    sx={{
      height: "100vh",
      bgcolor: "#e3f2fd", // light blue background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      px: 2,
    }}
  >
    <Paper
      elevation={4}
      sx={{
        maxWidth: 400,
        width: "100%",
        p: 4,
        borderRadius: 3,
        textAlign: "center",
        bgcolor: "background.paper",
      }}
    >
      <LockOutlinedIcon
        sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
      />
      <Typography variant="h5" fontWeight={600} mb={1}>
        You're Logged Out
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Please log in to continue to your dashboard and access your data.
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={onLoginClick}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Go to Login
      </Button>
    </Paper>
  </Box>
);

export default NoToken;
