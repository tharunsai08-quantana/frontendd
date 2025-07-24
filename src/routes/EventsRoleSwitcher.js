import React from "react";
import AdminEventsDashboard from "./AdminEventsDashboard";
import EventsDashboard from "./EventsDashboard";
import Mdashboard from "../mediater/Mdashboard";

const EventsRoleSwitcher = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "admin") {
    return <AdminEventsDashboard />;
  } else if (user?.role === "user") {
    return <EventsDashboard />;
  } 
   else if (user?.role === "gatekeeper") {
    return <Mdashboard />;
  }else {
    return <div>Unauthorized</div>;
  }
};

export default EventsRoleSwitcher;
    