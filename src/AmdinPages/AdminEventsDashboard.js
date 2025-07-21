import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import AdminAllEvents from "./AdminAllEvents";
import AdminWaitingEvents from "./AdminWaitingEvents";
import AdminApprovedEvents from "./AdminApprovedEvents";

const AdminEventsDashboard = () => {
  const [view, setView] = useState("all");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 4,
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(90deg, #81ecec, #74b9ff, #a29bfe)",
          borderRadius: 2,
          paddingX: 4,
          paddingY: 1.5,
          marginBottom: 4,
          boxShadow: 3,
        }}
      >
        <FormControl component="fieldset">
          <FormLabel
            component="legend"
            sx={{ color: "#2d3436", fontWeight: "bold", mb: 1 }}
          >
            Select View
          </FormLabel>
          <RadioGroup
            row
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All Events" />
            <FormControlLabel value="applied" control={<Radio />} label="Waiting Events" />
            <FormControlLabel value="approved" control={<Radio />} label="Approved Events" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ width: "100%", maxWidth: "1200px", px: 2 }}>
        {view === "all" && <AdminAllEvents />}
        {view === "applied" && <AdminWaitingEvents />}
        {view === "approved" && <AdminApprovedEvents />}
      </Box>
    </Box>
  );
};

export default AdminEventsDashboard;
