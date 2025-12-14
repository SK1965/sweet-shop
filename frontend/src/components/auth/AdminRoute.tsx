import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated and has admin role
  if (user && user.role === 'admin') {
    return <Outlet />;
  }

  // Redirect to home (or unauthorized page) if not admin
  return <Navigate to="/" replace />;
};

export default AdminRoute;
