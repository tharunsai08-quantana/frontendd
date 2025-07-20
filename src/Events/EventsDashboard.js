import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from "@mui/material";
import AllEvents from "./AllEvents";
import AppliedEvents from "./AppliedEvents";
import ApprovedEvents from "./ApprovedEvents";

const EventsDashboard = () => {
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
            
          </FormLabel>
          <RadioGroup
            row
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All Events" />
            <FormControlLabel value="applied" control={<Radio />} label="Applied Events" />
            <FormControlLabel value="approved" control={<Radio />} label="Approved Events" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ width: "100%", maxWidth: "1200px", px: 2 }}>
        {view === "all" && <AllEvents />}
        {view === "applied" && <AppliedEvents />}
        {view === "approved" && <ApprovedEvents />}
      </Box>
    </Box>
  );
};

export default EventsDashboard;
