import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import { useNavigate } from "react-router-dom";

const UnderMaintenance = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <ConstructionIcon sx={{ fontSize: 80, color: "orange", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        This Page is Under Maintenance
      </Typography>
      <Typography variant="body1" mb={4}>
        Currently working on this feature. Please check back later!
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go Back to Home
      </Button>
    </Box>
  );
};

export default UnderMaintenance;
