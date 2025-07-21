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
  TextField,
} from "@mui/material";
import axios from "axios";

const AdminAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noEventsMessage, setNoEventsMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});

  const fetchEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      const res = await axios.post("http://localhost:8000/auth/show_events", {
        email,
      });

      if (res.data.message === "No events found") {
        setNoEventsMessage(res.data.message);
        setEvents([]);
      } else {
        setEvents(res.data || []);
        setNoEventsMessage("");
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

  const handleEdit = (event) => {
    setEditingEventId(event.eventId);
    setEditedEvent({ ...event });
  };

  const handleFieldChange = (field, value) => {
    setEditedEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/update_event", {
        ...editedEvent,
      });

      setSnackbar({
        open: true,
        message: res.data.message || "Event updated successfully!",
        severity: "success",
      });

      setEvents((prev) =>
        prev.map((e) => (e.eventId === editedEvent.eventId ? editedEvent : e))
      );

      setEditingEventId(null);
    } catch (err) {
      console.error("Error updating event", err);
      setSnackbar({
        open: true,
        message: "Failed to update event.",
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

  if (noEventsMessage) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" color="textSecondary">
          {noEventsMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3} justifyContent="center" mt={2}>
        {events.map((event) => {
          const isEditing = editingEventId === event.eventId;

          return (
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
                  {isEditing ? (
                    <>
                      <TextField
                        label="Title"
                        value={editedEvent.title}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Description"
                        value={editedEvent.description}
                        onChange={(e) =>
                          handleFieldChange("description", e.target.value)
                        }
                        fullWidth
                        multiline
                        margin="dense"
                      />
                      <TextField
                        label="Speaker"
                        value={editedEvent.speaker}
                        onChange={(e) =>
                          handleFieldChange("speaker", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Date"
                        type="date"
                        value={editedEvent.date?.slice(0, 10)}
                        onChange={(e) => handleFieldChange("date", e.target.value)}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Location"
                        value={editedEvent.location}
                        onChange={(e) =>
                          handleFieldChange("location", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Image URL"
                        value={editedEvent.image}
                        onChange={(e) => handleFieldChange("image", e.target.value)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Hosted By"
                        value={editedEvent.hostedBy}
                        onChange={(e) =>
                          handleFieldChange("hostedBy", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Organizer"
                        value={editedEvent.organizer}
                        onChange={(e) =>
                          handleFieldChange("organizer", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Category"
                        value={editedEvent.category}
                        onChange={(e) =>
                          handleFieldChange("category", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {event.description}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Speaker:</strong> {event.speaker}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong>{" "}
                        {new Date(event.date || event.eventDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Location:</strong> {event.location}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Hosted By:</strong> {event.hostedBy}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Organizer:</strong> {event.organizer}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Category:</strong> {event.category}
                      </Typography>
                    </>
                  )}
                </CardContent>
                <Box textAlign="right">
                  {isEditing ? (
                    <Button variant="contained" onClick={handleSave}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={() => handleEdit(event)}>
                      Edit
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
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

export default AdminAllEvents;
