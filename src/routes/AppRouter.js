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

/**
 * Helper component to handle protected route logic
 */
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <NoToken />;

  if (role && user?.role !== role) {
    return <NoToken />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/faq" element={<UnderMaintenance />} />

      {/* Admin-only route */}
      <Route
        path="/create-event"
        element={
          <ProtectedRoute role="admin">
            <CreateEventForm />
          </ProtectedRoute>
        }
      />

<Route
  path="/events"
  element={
    <ProtectedRoute>
      {(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user?.role === "admin" ? <AdminEventsDashboard /> : <AdminEventsDashboard />;
      })()}
    </ProtectedRoute>
  }
/>


      {/* Optional: route for viewing all events (admin only?) */}
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute role="admin">
            <AdminAllEvents />
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRouter;
