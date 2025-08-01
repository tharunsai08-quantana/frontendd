import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import axios from "axios";

const ValidateCodePage = () => {
  const [code, setCode] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleValidate = async () => {
    if (code.length !== 36) {
      return setSnackbar({
        open: true,
        message: "Code must be exactly 36 characters",
        severity: "warning",
      });
    }

    try {
      const key = code.trim();
      const res = await axios.post("https://backend-l2dd.onrender.com/auth/event_verification", { key });

      setSnackbar({
        open: true,
        message: res.data?.message || "Validation successful!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Validation failed",
        severity: "error",
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#eef2f7">
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: 500,
          borderRadius: 4,
          background: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Validate Your Code
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Please enter your 36-character verification code
        </Typography>

        <TextField
          label="Verification Code"
          variant="outlined"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputProps={{ maxLength: 36 }}
        />

        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          sx={{ mt: 4, py: 1.5 }}
          onClick={handleValidate}
        >
          Validate
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ValidateCodePage;
