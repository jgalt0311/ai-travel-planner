import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Components
import HomePage from './components/Home/HomePage';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ItineraryForm from './components/Itinerary/ItineraryForm';
import ItineraryDetail from './components/Itinerary/ItineraryDetail';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />

            {/* Protected Routes */}
            <Route
              path="/create-itinerary"
              element={
                <ProtectedRoute>
                  <ItineraryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/itinerary/:id"
              element={
                <ProtectedRoute>
                  <ItineraryDetail />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}