import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Event created successfully!");
        setFormData({ title: "", description: "", eventDate: "", location: "" });
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <Grid container justifyContent="center" mt={4}>
      <Grid item xs={11} sm={8} md={6}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Create New Event
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Event Date"
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create Event
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateEventForm;
