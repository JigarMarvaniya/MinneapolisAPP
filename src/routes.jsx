import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import DriverDashboard from './components/Driver/DriverDashboard';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        user
          ? user.type === 'customer'
            ? <CustomerDashboard />
            : <DriverDashboard />
          : <Navigate to="/login" />
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/customer" element={user && user.type === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} />
      <Route path="/driver" element={user && user.type === 'driver' ? <DriverDashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
