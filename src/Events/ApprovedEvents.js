import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const ApprovedEvents = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [open, setOpen] = useState(false);

  const email = JSON.parse(localStorage.getItem("user"))?.email;
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const res = await axios.post("https://backend-l2dd.onrender.com/auth/applied_event", {
          email,
          role,
        });
        const approved = res.data.data?.filter((e) => e.status === "Approved") || [];
        setApprovedEvents(approved);
      } catch (err) {
        console.error("Error fetching approved events", err);
      }
    };

    if (email) {
      fetchApprovedEvents();
    }
  }, [email]);

  const handleShowQR = (event) => {
    setSelectedQR(event);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      {approvedEvents.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          No approved events available.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {approvedEvents.map((event) => (
            <Grid item xs={12} md={4} key={event._id}>
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
              >             <CardContent>
                  <Grid container spacing={1} alignItems="center">
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
                      <Typography
                        variant="caption"
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          px: 1.2,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 500,
                          display: "inline-block",
                        }}
                      >
                        {new Date(event.eventDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Name */}
                  <Typography variant="body2" mt={1}>
                    Approved for: {event.name}
                  </Typography>

                  {/* Button */}
                  <Button
                    onClick={() => handleShowQR(event)}
                    sx={{ mt: 2 }}
                    variant="outlined"
                    fullWidth
                  >
                    View QR Code & Key
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* QR Code Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Event QR & Key</DialogTitle>
        <DialogContent>
          {selectedQR && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Key ID:
              </Typography>
              <Typography variant="body2" mb={2}>
                {selectedQR.keyId}
              </Typography>
              <img src={selectedQR.qrCode} alt="QR Code" style={{ width: "200px" }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApprovedEvents;
