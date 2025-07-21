import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions
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
        const res = await axios.post("http://localhost:8000/auth/applied_event", { email,role });
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
      <Grid container spacing={2}>
        {approvedEvents.map((event) => (
          <Grid item xs={12} md={6} key={event._id}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2">Approved for: {event.name}</Typography>
                <Typography variant="body2">
                  Date: {new Date(event.eventDate).toLocaleString()}
                </Typography>
                <Button onClick={() => handleShowQR(event)} sx={{ mt: 2 }} variant="outlined">
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
            <Typography variant="subtitle2" gutterBottom>Key ID:</Typography>
            <Typography variant="body2" mb={2}>{selectedQR.keyId}</Typography>
            <img src={selectedQR.qrCode} alt="QR Code" style={{ width: "200px" }} />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  </>
);
}



export default ApprovedEvents;
