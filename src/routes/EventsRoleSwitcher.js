import React from "react";
import AdminEventsDashboard from "./AdminEventsDashboard";
import EventsDashboard from "./EventsDashboard";

const EventsRoleSwitcher = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "admin") {
    return <AdminEventsDashboard />;
  } else if (user?.role === "user") {
    return <EventsDashboard />;
  } else {
    return <div>Unauthorized</div>;
  }
};

export default EventsRoleSwitcher;
    