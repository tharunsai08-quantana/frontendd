import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, TableSortLabel, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";
import axios from "axios";

const ApprovedEvents = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [open, setOpen] = useState(false);
  const [orderBy, setOrderBy] = useState("title");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/approved_events");

        // Updated to match your payload structure
        const approved = res.data.events?.filter((e) => e.status === "Approved") || [];
        setApprovedEvents(approved);
        console.log("Fetched approved events:", approved);
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

  const handleShowQR = (event) => {
    setSelectedQR(event);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
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
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>QR Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEvents.map((event) => (
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
};

export default ApprovedEvents;
