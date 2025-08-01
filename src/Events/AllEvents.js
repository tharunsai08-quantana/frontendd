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

      const res = await axios.post("https://backend-l2dd.onrender.com/auth/show_events", {
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
        "https://backend-l2dd.onrender.com/auth/apply_event",
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
      <Grid container spacing={4} justifyContent="center" mt={2}>
        {events.map((event) => (
<Grid item xs={12} sm={6} md={4} lg={4} key={event._id}>
            <Card
              sx={{
                width: "100%",
                minHeight: 300,
                backgroundColor: "#ffffff",
                boxShadow: 4,
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 8,
                },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  height: 80,
                  background: "linear-gradient(135deg, #42a5f5, #478ed1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  color: "#fff",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {event.title}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    color: "#1976d2",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {new Date(event.eventDate).toLocaleDateString()}
                </Box>
              </Box>

              {/* Content */}
              <CardContent
  sx={{
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  }}
>
  <Typography
    variant="body2"
    color="text.secondary"
    sx={{ whiteSpace: "pre-wrap" }}
  >
    {event.description}
  </Typography>

  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <Typography variant="body2">
        <strong>Speaker:</strong> {event.speaker || "TBA"}
      </Typography>
      <Typography variant="body2">
        <strong>Location:</strong> {event.location}
      </Typography>
    </Grid>
  </Grid>

  {/* Apply Now button in separate row and centered */}
  <Box sx={{ textAlign: "center", mt: 2 }}>
    <Button
      variant="contained"
      size="medium"
      sx={{
        textTransform: "none",
        borderRadius: 2,
        px: 4,
        py: 1.2,
        fontWeight: 600,
        backgroundColor: "#1976d2",
        "&:hover": {
          backgroundColor: "#125ea6",
        },
      }}
      onClick={() => handleApply(event)}
    >
      Apply Now
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
