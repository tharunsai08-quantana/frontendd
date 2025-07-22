import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, TableSortLabel, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Button, Typography, TextField
} from "@mui/material";
import axios from "axios";

const ApprovedEvents = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [open, setOpen] = useState(false);
  const [orderBy, setOrderBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/approved_events");
        const approved = res.data.events?.filter((e) => e.status === "Approved") || [];
        setApprovedEvents(approved);
      } catch (err) {
        console.error("Error fetching approved events", err);
      }
    };

    fetchApprovedEvents();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedEvents = [...approvedEvents].sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    if (orderBy === "eventDate") {
      return order === "asc"
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    } else {
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
  });

  const filteredEvents = sortedEvents.filter((event) =>
    `${event.title} ${event.name} ${new Date(event.eventDate).toLocaleString()}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleShowQR = (event) => {
    setSelectedQR(event);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Approved Events
      </Typography>

      <TextField
        label="Search by title, name, or date"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "title"}
                  direction={orderBy === "title" ? order : "asc"}
                  onClick={() => handleSort("title")}
                >
                  Event Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Approved For
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "eventDate"}
                  direction={orderBy === "eventDate" ? order : "asc"}
                  onClick={() => handleSort("eventDate")}
                >
                  Event Date
                </TableSortLabel>
              </TableCell>
              <TableCell>QR Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{new Date(event.eventDate).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleShowQR(event)} variant="outlined" size="small">
                    View QR
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* QR Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Event QR & Key</DialogTitle>
        <DialogContent>
          {selectedQR && (
            <>
              <Typography variant="subtitle2">Key ID:</Typography>
              <Typography variant="body2" mb={2}>{selectedQR.keyId}</Typography>
              <img src={selectedQR.qrCode} alt="QR Code" style={{ width: 200, marginTop: 10 }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ApprovedEvents;
