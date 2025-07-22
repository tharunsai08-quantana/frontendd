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
      const res = await axios.post("http://localhost:8000/auth/applied_event", {
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
      await axios.post("http://localhost:8000/auth/delete_event", {
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
      <Grid container spacing={3}>
        {appliedEvents.length === 0 ? (
          <Box width="100%" textAlign="center">
            <Typography variant="h6">No events applied yet.</Typography>
          </Box>
        ) : (
          appliedEvents.map((event) => (
            <Grid item xs={12} md={6} key={event._id}>
              <Card sx={{ p: 2, backgroundColor: "#f5f5f5", boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    <strong>Date:</strong>{" "}
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : "N/A"}
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
