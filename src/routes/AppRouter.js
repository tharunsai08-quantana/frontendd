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
import LayoutWrapper from './LayoutWrapper';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <NoToken />;
  if (role && user?.role !== role) return <NoToken />;
  return children;
};

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
      <Route path="/" element={<LayoutWrapper><LandingPage /></LayoutWrapper>} />
      <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
      <Route path="/signup" element={<LayoutWrapper><Signup /></LayoutWrapper>} />
      <Route path="/forgot_password" element={<LayoutWrapper><ForgotPassword /></LayoutWrapper>} />
      <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
      <Route path="/faq" element={<LayoutWrapper><UnderMaintenance /></LayoutWrapper>} />
      <Route path="/client" element={<LayoutWrapper><Mdashboard /></LayoutWrapper>} />
      <Route
        path="/create-event"
        element={
          <ProtectedRoute role="admin">
            <LayoutWrapper>
              <CreateEventForm />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events_dashboard"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <EventsRoleSwitcher />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<LayoutWrapper><LandingPage /></LayoutWrapper>} />
    </Routes>
  );
};

export default AppRouter;
