import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ValidateCodePage from "./ValidateCodePage";
import VerifiedList from "./verifiedList";
import EventsCreated from "./EventsCreated";

const Mdashboard = () => {
  const [view, setView] = useState("validate");

  const views = {
        created: {
      label: "Events Created",
      component: <EventsCreated />,
    },
    validate: {
      label: "Validate Code",
      component: <ValidateCodePage />,
    },
    verified: {
      label: "Verified Users",
      component: <VerifiedList />,
    },

  };

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
            {Object.entries(views).map(([key, { label }]) => (
              <FormControlLabel
                key={key}
                value={key}
                control={<Radio />}
                label={label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ width: "100%", maxWidth: "1200px", px: 2 }}>
        {views[view].component}
      </Box>
    </Box>
  );
};

export default Mdashboard;
