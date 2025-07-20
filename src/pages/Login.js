import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  MenuItem,
} from "@mui/material";
import NoToken from "../components/NoToken"; // assuming NoToken.js is in the same folder

const CreateEvent = () => {
  const token = localStorage.getItem("token");
  const role = JSON.parse(localStorage.getItem("role"));

  const [eventData, setEventData] = useState({
    eventId: "",
    organizer: "",
    title: "",
    speaker: "",
    image: "",
    hostedBy: "",
    category: "",
    description: "",
    eventDate: "",
    location: "",
    createdBy: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Event created successfully!");
        setEventData({});
      } else {
        alert(data.message || "Error creating event");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create event.");
    }
  };

  if (!token) return <NoToken onLoginClick={() => window.location.href = "/login"} />;
  if (role !== "admin") {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" color="error">Access Denied</Typography>
        <Typography>You do not have permission to create events.</Typography>
      </Box>
    );
  }

  return (
    <Box mt={5} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 700 }}>
        <Typography variant="h5" mb={3}>Create New Event</Typography>
        <Grid container spacing={2}>
          {[
            { label: "Event ID", name: "eventId" },
            { label: "Organizer", name: "organizer" },
            { label: "Title", name: "title" },
            { label: "Speaker", name: "speaker" },
            { label: "Image URL", name: "image" },
            { label: "Hosted By", name: "hostedBy" },
            { label: "Category", name: "category" },
            { label: "Location", name: "location" },
            { label: "Created By", name: "createdBy" },
          ].map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                label={field.label}
                name={field.name}
                fullWidth
                value={eventData[field.name]}
                onChange={handleChange}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              label="Event Date & Time"
              type="datetime-local"
              name="eventDate"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={eventData.eventDate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={eventData.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
          Create Event
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateEvent;
