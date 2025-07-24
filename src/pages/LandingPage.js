import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const [totalEvents, setTotalEvents] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [displayEvents, setDisplayEvents] = useState(0);
  const [displayUsers, setDisplayUsers] = useState(0);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  fetch("https://backend-l2dd.onrender.com/auth/count", {
    method: "GET",
  })
    .then((res) => res.json())
    .then(({ totalEvents, totaluser }) => {
      setTotalEvents(totalEvents);
      setTotalUsers(totaluser);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch counts:", err);
      setLoading(false);
    });
}, []);


  useEffect(() => {
    if (loading) return;

    const duration = 2000; // 2 seconds total
    const intervalTime = 30; // update every 30ms

    const eventsStep = totalEvents / (duration / intervalTime);
    const usersStep = totalUsers / (duration / intervalTime);

    let currentEvents = 0;
    let currentUsers = 0;

    const interval = setInterval(() => {
      currentEvents += eventsStep;
      currentUsers += usersStep;

      if (currentEvents >= totalEvents) currentEvents = totalEvents;
      if (currentUsers >= totalUsers) currentUsers = totalUsers;

      setDisplayEvents(Math.floor(currentEvents));
      setDisplayUsers(Math.floor(currentUsers));

      if (currentEvents === totalEvents && currentUsers === totalUsers) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [loading, totalEvents, totalUsers]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(135deg, #2f7989ff 25%, #66bb6a 50%, #ffb74d 75%, #ff5252 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        p: { xs: 4, md: 8 },
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Grid container spacing={4} sx={{ flex: 1 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="white">
            Welcome to the Event Access & Verification Portal
          </Typography>

          <Typography variant="h6" color="white" mb={3}>
            Explore our upcoming tech-powered events:
          </Typography>

          <List sx={{ color: "white" }}>
            <ListItem>
              <ListItemText primary="🌐 AI Future Conference – Dive into real-world AI & ML innovations." />
            </ListItem>
            <ListItem>
              <ListItemText primary="🔒 Cybersecurity Summit – Stay protected in the digital era." />
            </ListItem>
            <ListItem>
              <ListItemText primary="💸 Quantum Finance Meetup – The future of fintech is quantum." />
            </ListItem>
            <ListItem>
              <ListItemText primary="🏥 Healthcare Innovation Forum – Tech transforming patient care." />
            </ListItem>
          </List>

          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={handleGoToLogin}
            sx={{ mt: 4 }}
          >
            Get Started
          </Button>
        </Grid>
      </Grid>

      {/* Countup Section */}
      <Box
        sx={{
          mt: 6,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                p: 4,
                width: 180,
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <Typography variant="h6" color="white" gutterBottom>
                Total Events
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color="white"
                sx={{ userSelect: "none" }}
              >
                {displayEvents}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                p: 4,
                width: 180,
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <Typography variant="h6" color="white" gutterBottom>
                Total Users Attended
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color="white"
                sx={{ userSelect: "none" }}
              >
                {displayUsers}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default LandingPage;
