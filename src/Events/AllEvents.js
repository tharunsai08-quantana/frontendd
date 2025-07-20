import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
  
      const res = await axios.post("http://localhost:8000/auth/show_events", {
        email,
      });
  
      const fetched = res.data;
  
      if (Array.isArray(fetched)) {
        setEvents(fetched);
      } else if (Array.isArray(fetched.events)) {
        setEvents(fetched.events);
      } else {
        setEvents([]);
        setSnackbar({
          open: true,
          message: "No events returned from server.",
          severity: "info",
        });
      }
    } catch (err) {
      console.error("Error fetching events", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch events.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleApply = async (event) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const { email, name } = user || {};

    if (!name || !email) {
      setSnackbar({
        open: true,
        message: "User info missing. Please log in.",
        severity: "warning",
      });
      return;
    }

    const payload = {
      eventId: event.eventId,
      title: event.title,
      eventDate: event.eventDate,
      name,
      email,
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/auth/apply_event",
        payload
      );

      setSnackbar({
        open: true,
        message: res.data.message || "Successfully applied!",
        severity: "success",
      });

      // Remove the applied event from the list
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.eventId !== event.eventId)
      );
    } catch (err) {
      console.error("Apply failed", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to apply for event.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
        <Typography variant="body2" mt={2}>
          Loading events...
        </Typography>
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h6" color="text.secondary">
          No upcoming events available.
        </Typography>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3} justifyContent="center" mt={2}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={5} key={event._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 4,
                borderRadius: 3,
                p: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {event.description}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Date:</strong>{" "}
                  {new Date(event.eventDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Speaker:</strong> {event.speaker}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <strong>Location:</strong> {event.location}
                </Typography>
              </CardContent>
              <Box textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApply(event)}
                >
                  Apply
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AllEvents;
