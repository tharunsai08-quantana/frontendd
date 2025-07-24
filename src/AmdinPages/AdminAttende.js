import React, { useEffect, useState } from "react";
import {
  Paper, Typography, TextField, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, Checkbox
} from "@mui/material";
import axios from "axios";

const AttendedUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://backend-l2dd.onrender.com/auth/attended_user"); // Update if you use full API URL
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch attended users:", err);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === filteredUsers.length) {
      setSelected([]);
    } else {
      const allIds = filteredUsers.map(user => user._id);
      setSelected(allIds);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter((user) => {
    const val = `${user.title} ${user.name} ${user.email}`.toLowerCase();
    return val.includes(search.toLowerCase());
  });

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>Attended Users</Typography>

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

              <TableCell>Title</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Verification Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.title}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.verificationTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AttendedUsersTable;
