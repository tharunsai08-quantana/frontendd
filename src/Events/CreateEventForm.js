import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";

const CreateEventForm = () => {
  const [eventData, setEventData] = useState({
    organizer: "",
    title: "",
    speaker: "",
    image: "",
    hostedBy: "",
    category: "",
    description: "",
    eventDate: "",
    location: "",
  });

  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const decoded = JSON.parse(atob(storedToken.split(".")[1]));

      } catch (err) {
        console.warn("Invalid token");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://backend-l2dd.onrender.com/auth/create_event",
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbarMessage("✅ Event created successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);

      setEventData({
        organizer: "",
        title: "",
        speaker: "",
        image: "",
        hostedBy: "",
        category: "",
        description: "",
        eventDate: "",
        location: "",
      });
    } catch (error) {
      console.error("❌ Error creating event:", error);
      setSnackbarMessage("❌ Failed to create event.");
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f9f9f9",
        minHeight: "100vh",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 800,
          borderRadius: 4,
          background: "#ffffff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Create New Event
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", mb: 4, color: "text.secondary" }}
        >
          Fill in the details below to publish a new event
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {[
              { label: "Organizer", name: "organizer" },
              { label: "Title", name: "title" },
              { label: "Speaker", name: "speaker" },
              { label: "Image URL", name: "image" },
              { label: "Hosted By", name: "hostedBy" },
              { label: "Category", name: "category" },
              { label: "Description", name: "description" },
              { label: "Location", name: "location" },
            ].map((field, index) => (
              <Grid item xs={12} sm={index % 2 === 0 ? 6 : 6} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={eventData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                label="Event Date and Time"
                name="eventDate"
                type="datetime-local"
                value={eventData.eventDate}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  py: 1.5,
                  background: "linear-gradient(to right, #1976d2, #2196f3)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  "&:hover": {
                    background: "linear-gradient(to right, #1565c0, #1e88e5)",
                  },
                }}
              >
                🚀 Publish Event
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar Feedback */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateEventForm;
