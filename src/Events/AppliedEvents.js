import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const AppliedEvents = () => {
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;
  const role = user?.role;

  const fetchAppliedEvents = async () => {
    try {
      const res = await axios.post("https://backend-l2dd.onrender.com/auth/applied_event", {
        email,
        role,
      });
      setAppliedEvents(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching applied events:", error);
      setSnackbar({ open: true, message: "Failed to load events", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.post("https://backend-l2dd.onrender.com/auth/delete_event", {
        email,
        eventId,
      });

      setAppliedEvents((prev) => prev.filter((e) => e.eventId !== eventId));
      setSnackbar({ open: true, message: "Event deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Error deleting event:", error);
      setSnackbar({ open: true, message: "Failed to delete event", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (email) fetchAppliedEvents();
  }, [email, role]);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Grid container spacing={4} justifyContent="center">
        {appliedEvents.length === 0 ? (
          <Box width="100%" textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No events applied yet.
            </Typography>
          </Box>
        ) : (
          appliedEvents.map((event) => (
            <Grid item xs={12} sm={10} md={8} lg={6} key={event._id}>
              <Card
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: 4,
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 8,
                  },
                }}
              >
                {/* Header */}
                <Box
  sx={{
    background: "linear-gradient(to right, #42a5f5, #1e88e5)",
    color: "#fff",
    px: 2,
    py: 1.5,
  }}
>
  <Grid container alignItems="center" spacing={2}>
    <Grid item xs={12} sm={8}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          wordBreak: "break-word",
          lineHeight: 1.3,
        }}
      >
        {event.title}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={4} textAlign={{ xs: "left", sm: "right" }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          color: "#1976d2",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          fontSize: "0.8rem",
          fontWeight: 600,
          display: "inline-block",
        }}
      >
        {event.eventDate
          ? new Date(event.eventDate).toLocaleDateString()
          : "N/A"}
      </Box>
    </Grid>
  </Grid>
</Box>


                {/* Content */}
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You have successfully applied for this event.
                  </Typography>

                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" color="success" disabled>
                      Applied
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(event.eventId)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppliedEvents;
