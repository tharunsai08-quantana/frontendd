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
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
        mt={2}
      >
        {events.map((event) => (
          <Grid item xs={12} md={10} lg={8} key={event._id}>
           <Card
  sx={{
    width: "100%",
    height: 260, // Fixed height for uniform card size
    backgroundColor: "#f5f5f5",
    boxShadow: 3,
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
    transition: "0.3s",
    "&:hover": {
      boxShadow: 6,
    },
  }}
>

              <CardContent
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* Left Content */}
                <Box sx={{ flex: 1, minWidth: "250px" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1, wordBreak: "break-word" }}
                  >
                    {event.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, whiteSpace: "pre-wrap" }}
                  >
                    {event.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong>{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Right Content */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minWidth: "180px",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>Speaker:</strong> {event.speaker}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {event.location}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleApply(event)}
                  >
                    Apply
                  </Button>
                </Box>
              </CardContent>
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
