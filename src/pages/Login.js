import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const generateCaptcha = () => {
  const chars = "123456789"; // added characters here
  let captcha = "";
  for (let i = 0; i < 6; i++) { // make captcha 6 chars instead of 1
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = () => {
  const [name, setName] = useState(""); // changed setEmail to setName for clarity
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (userCaptcha.toUpperCase() !== captcha) {
      setError("❌ Invalid CAPTCHA. Please try again.");
      setCaptcha(generateCaptcha());
      setUserCaptcha("");
      return;
    }

 try {
  const response = await fetch(`https://backend-l2dd.onrender.com/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      password,
    }),
  });
  const data = await response.json();

  if (data.token) {
    setError("");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/dashboard");
  } else {
    setError(data.message || "❌ Login failed.");
    setCaptcha(generateCaptcha());
    setUserCaptcha("");
  }
} catch (error) {
  console.error("Login error:", error);
  setError("❌ Something went wrong. Please try again.");
  setCaptcha(generateCaptcha());
  setUserCaptcha("");
}

  };

  // Your original colors and styles untouched
  const blue = "#1976d2";
  const ash = "#f5f5f5";
  const inputBorderColor = "#cfd8dc";

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: ash,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Left panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          py: 6,
          backgroundColor: blue,
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="bold" mb={2} textAlign="center">
          Welcome Back!
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 400, textAlign: "center", opacity: 0.85 }}
        >
          Log in to your account and explore data with real-time insights.
        </Typography>
      </Grid>

      {/* Right panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          py: 6,
          backgroundColor: ash,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 420,
            borderRadius: 3,
            backgroundColor: "white",
            border: `1px solid ${inputBorderColor}`,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            mb={4}
            align="center"
            color={blue}
          >
            User Login
          </Typography>

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)} // fixed setter name
            autoComplete="email"
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Box
            sx={{
              my: 3,
              py: 1.5,
              textAlign: "center",
              fontSize: 24,
              fontWeight: 600,
              backgroundColor: ash,
              borderRadius: 2,
              userSelect: "none",
              color: blue,
              border: `2px solid ${blue}`,
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: 6,
              cursor: "default",
            }}
          >
            {captcha}
          </Box>

          <TextField
            label="Enter CAPTCHA"
            variant="outlined"
            fullWidth
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
            inputProps={{ style: { letterSpacing: "0.2em" } }}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1} textAlign="center">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              py: 1.8,
              borderRadius: 2,
              backgroundColor: blue,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Box
            mt={3}
            display="flex"
            justifyContent="space-between"
            fontSize="0.9rem"
            color={blue}
          >
            {/* Used react-router-dom's Link for client side navigation */}
            <Link component={RouterLink} to="#" underline="hover" sx={{ color: blue }}>
              Forgot Password?
            </Link>
            <Link component={RouterLink} to="/signup" underline="hover" sx={{ color: blue }}>
              Signup
            </Link>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
