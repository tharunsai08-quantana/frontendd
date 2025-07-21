import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import UnderMaintenance from '../pages/UnderMaintenance';

import CreateEventForm from '../Events/CreateEventForm';
import EventsDashboard from '../Events/EventsDashboard';
import AdminEventsDashboard from '../AmdinPages/AdminEventsDashboard';
import AdminAllEvents from '../AmdinPages/AdminAllEvents';

import NoToken from '../components/NoToken';
import AdminRoute from '../components/AdminRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/faq" element={<UnderMaintenance />} />

      <Route
        path="/events"
        element={
            <EventsDashboard />
        }
      />

      <Route
        path="/admin/events"
        element={
          <AdminRoute>
            <AdminEventsDashboard />
          </AdminRoute>
        }
      />
  
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRouter;
