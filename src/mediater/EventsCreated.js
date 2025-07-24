import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";

const EventStatsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/event_data");
        setEvents(res.data.nextEvents || []);
      } catch (err) {
        console.error("Error fetching event stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const groupedByDate = events.reduce((acc, event) => {
    const formattedDate = dayjs(event.eventDate).format("MMMM D, YYYY");
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(event);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {Object.entries(groupedByDate).map(([date, eventsOnDate]) => (
        <Box key={date} mb={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            📅 {date}
          </Typography>
          <Grid container spacing={2}>
            {eventsOnDate.map((event, idx) => (
              <Grid item xs={12} key={idx}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography sx={{ color: "#1565c0", fontWeight: 600 }}>
                      Approved Users: {event.approvedCount}
                    </Typography>
                    <Typography sx={{ color: "#2e7d32", fontWeight: 600 }}>
                      Attended Users: {event.attendedCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ mt: 3 }} />
        </Box>
      ))}
    </Box>
  );
};

export default EventStatsDashboard;
