import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState({});

  const colors = {
    bg: "#f5f5f5",
    primary: "#1976d2",
    paper: "#fff",
    text: "#333",
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Username is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Invalid email address";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setShowEmoji({ ...showEmoji, [name]: value.length > 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
  
    if (validateForm()) {
      try {
        const { name, email, password } = formData;
        const res = await fetch("http://localhost:8000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
  
        const data = await res.json();
        if (res.status === 201) {
          setMessage(`✅ ${data.message}`);
          setTimeout(() => navigate("/login"), 3500);
        } else {
          setMessage(`❌ ${data.message || "Signup failed"}`);
        }
      } catch (err) {
        console.error("Signup error:", err);
        setMessage("❌ Something went wrong. Please try again.");
      }
    }
  
    setIsLoading(false);
  };
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          maxWidth: 1000,
          display: "flex",
          minHeight: 600,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Left panel - Signup Form */}
        <Box sx={{ flex: 1, p: 5, backgroundColor: colors.paper }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Create Account
          </Typography>

          {message && (
            <Alert
              severity={message.includes("✅") ? "success" : "error"}
              sx={{ my: 2 }}
            >
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {["name", "email"].map((field) => (
              <TextField
                key={field}
                fullWidth
                name={field}
                label={field === "name" ? "Username" : "Email"}
                type={field === "email" ? "email" : "text"}
                margin="normal"
                value={formData[field]}
                onChange={handleChange}
                error={!!errors[field]}
                helperText={errors[field]}
                InputProps={{
                  endAdornment: showEmoji[field] && (
                    <InputAdornment position="end">
                      {{
                        name: <span role="img" aria-label="person">😊</span>,
                        email: <span role="img" aria-label="email">📧</span>,
                      }[field]}
                    </InputAdornment>
                  ),
                }}
              />
            ))}

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showEmoji.password && <span role="img" aria-label="lock">🔒</span>}
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              name="confirmPassword"
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
<Button
  type="submit"
  fullWidth
  variant="contained"
  disabled={isLoading}
  sx={{
    mt: 3,
    backgroundColor: colors.primary,
    fontWeight: "bold",
  }}
>
  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
</Button>

          </form>
        </Box>

        {/* Right panel - Info */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: colors.primary,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            Welcome Back!
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 2, maxWidth: 300, textAlign: "center" }}
          >
            Already have an account? Log in to access your xx!
          </Typography>
          <Button
            variant="outlined"
            sx={{
              mt: 4,
              borderColor: "#fff",
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#ffffff22",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
