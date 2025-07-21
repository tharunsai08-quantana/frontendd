import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Button, TextField, Typography
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import axios from "axios";

const ApprovedEvents = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = localStorage.getItem("user");
  let email = null;
  let role = null;

  try {
    const parsed = JSON.parse(userData);
    email = parsed?.email;
    role = parsed?.role;
  } catch (err) {
    console.warn("Invalid user data in localStorage");
  }



  useEffect(() => {
  const fetchApprovedEvents = async () => {
    try {
      const userData = localStorage.getItem("user");
      const parsed = JSON.parse(userData);
      const email = parsed?.email;
      const role = parsed?.role;

    
      console.log("Calling API: /auth/applied_event with", { email, role });

      const res = await axios.post("http://localhost:8000/auth/applied_event", {
        email,
        role,
      });

      console.log("API response:", res.data);

      const applied = res.data.data?.filter((e) => e.status === "Applied") || [];
      setApprovedEvents(applied);
    } catch (err) {
      console.error("Error fetching approved events", err?.response?.data || err.message);
    }
  };

  fetchApprovedEvents();
}, []); // Only run once on component mount



  const handleSelect = (eventId) => {
    setSelected((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleBulkApprove = async () => {
    setLoading(true);
    try {
      const selectedEvents = approvedEvents.filter((e) => selected.includes(e._id));

      for (const event of selectedEvents) {
        const payload = {
          eventId: event.eventId,
          name: event.name,
          email: event.email,
          status: "Approved",
          title: event.title,
          eventDate: event.eventDate,
        };

        await axios.post("http://localhost:8000/auth/approve_status", payload);
      }

      alert("Approved selected users");
      setApprovedEvents((prev) => prev.filter((e) => !selected.includes(e._id)));
      setSelected([]);
    } catch (err) {
      console.error("Approval failed", err?.response?.data || err.message);
      alert("Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSingleApprove = async (eventId) => {
    try {
      const event = approvedEvents.find((e) => e._id === eventId);
      if (!event) return;

      const payload = {
        eventId: event.eventId,
        name: event.name,
        email: event.email,
        status: "Approved",
        title: event.title,
        eventDate: event.eventDate,
      };

      await axios.post("http://localhost:8000/auth/approve_status", payload);
      alert("User approved");

      setApprovedEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      console.error("Approval failed", err?.response?.data || err.message);
      alert("Approval failed");
    }
  };

  const filteredEvents = approvedEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>Events Awaiting Approval</Typography>

      <TextField
        label="Search by title, name or email"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Event ID</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Approve</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(event._id)}
                    onChange={() => handleSelect(event._id)}
                  />
                </TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.email}</TableCell>
                <TableCell>{event.eventId}</TableCell>
                <TableCell>{new Date(event.eventDate).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleSingleApprove(event._id)}>
                    <CheckCircle color="success" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selected.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleBulkApprove}
          disabled={loading}
        >
          {loading ? "Approving..." : "Approve Selected"}
        </Button>
      )}
    </Paper>
  );
};

export default ApprovedEvents;
