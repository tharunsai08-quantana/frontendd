import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import CreateEventForm from '../Events/CreateEventForm';
import EventsDashboard from '../Events/EventsDashboard';
import AdminEventsDashboard from '../AmdinPages/AdminEventsDashboard';
import AdminRoute from '../components/AdminRoute';
import NoToken from '../components/NoToken'; 
import AdminAllEvents from '../AmdinPages/AdminAllEvents'; 
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/create-event"
        element={
          localStorage.getItem("token") ? (
            <AdminRoute>
              <CreateEventForm />
            </AdminRoute>
          ) : (
            <NoToken />
          )
        }
      />
      {/* <Route path="/admin_events" element={<AdminAllEvents />} /> */}
      <Route path="/admin_events" element={<AdminEventsDashboard />} />

      
      <Route path="/events" element={localStorage.getItem("token") ? ( <EventsDashboard />):(<NoToken />)} />   
      <Route path="*" element={<LandingPage />} /> {/* fallback */}
    </Routes>
  );
};

export default AppRouter;
