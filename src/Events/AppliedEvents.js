import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

const AppliedEvents = () => {
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;
  const role = user?.role;

  useEffect(() => {
    const fetchAppliedEvents = async () => {
      try {
        const res = await axios.post("http://localhost:8000/auth/applied_event", {
          email,
          role,
        });
        setAppliedEvents(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching applied events:", error);
      } finally {
        setLoading(false);
      }
    };

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
    <Grid container spacing={2}>
      {appliedEvents.length === 0 ? (
        <Box width="100%" textAlign="center" mt={5}>
          <Typography variant="h6">No events applied yet.</Typography>
        </Box>
      ) : (
        appliedEvents.map((event) => (
          <Grid item xs={12} md={6} key={event._id}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2">
                  Applied by: {event.name}
                </Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  Event Date:{" "}
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleString()
                    : "N/A"}
                </Typography>
                <Chip label={event.status || "Pending"} color="warning" />
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default AppliedEvents;
