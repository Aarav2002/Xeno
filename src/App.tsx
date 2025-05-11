import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Segments from './pages/Segments';
import SegmentBuilder from './pages/SegmentBuilder';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Layout from './components/layout/Layout';
import { Toaster } from 'react-hot-toast';
import DemoVideo from './pages/DemoVideo';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Protected route component that checks for authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="segments" element={<Segments />} />
              <Route path="segments/builder" element={<SegmentBuilder />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="campaigns/:id" element={<CampaignDetail />} />
              <Route path="/demo-video" element={<DemoVideo />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;