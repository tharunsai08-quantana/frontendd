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
import Mdashboard from '../mediater/Mdashboard';
import NoToken from '../components/NoToken';

/**
 * ProtectedRoute checks token and role
 */
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <NoToken />;
  if (role && user?.role !== role) return <NoToken />;

  return children;
};

/**
 * Component to switch dashboard based on role
 */
const EventsRoleSwitcher = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user?.role === "admin") return <AdminEventsDashboard />;
  if (user?.role === "user") return <EventsDashboard />;
  if (user?.role === "gatekeeper") return <Mdashboard />;

  return <NoToken />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* Public Landing Page */}
      <Route path="/login" element={<Login />} />   {/* Login Page */}
      <Route path="/signup" element={<Signup />} /> {/* Signup Page */}
      <Route path="/forgot_password" element={<ForgotPassword />} /> {/* Forgot Password */}
      <Route path="/dashboard" element={<Dashboard />} /> {/* User Dashboard */}
      <Route path="/faq" element={<UnderMaintenance />} /> {/* Temporary FAQ Page */}
      <Route path="/client" element={<Mdashboard />} /> {/* Temporary FAQ Page */}

      <Route
        path="/create-event"
        element={
          <ProtectedRoute role="admin">
            <CreateEventForm />
          </ProtectedRoute>
        }
      /> {/* Admin Create Event */}

      <Route
        path="/events_dashboard"
        element={
          <ProtectedRoute>
            <EventsRoleSwitcher />
          </ProtectedRoute>
        }
      /> 

      <Route path="*" element={<LandingPage />} /> {/* Catch-all fallback */}
    </Routes>
  );
};

export default AppRouter;
