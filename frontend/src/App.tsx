import React from 'react';
import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import PersonalPage from './pages/staff/PersonalPage';
import BrukarePage from './pages/user/BrukarePage';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleGate } from './components/RoleGate';
import { TokenInspector } from './components/TokenInspector';
import { LoadingScreen } from './components/LoadingScreen';

/**
 * A component to protect routes based on authentication and roles
 */
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: ("Admin" | "Personal" | "Brukare")[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <LoadingScreen label="Loggar in" />;
  }

  return (
    <RoleGate allowedRoles={allowedRoles} fallback={<Navigate to="/" replace />}>
      {children}
    </RoleGate>
  );
};

const AppContent: React.FC = () => {
  const { isLoading, isLoggingIn, isLoggingOut, loadingLabel } = useAuth();

  // Unified priority loading logic
  if (loadingLabel) return <LoadingScreen label={loadingLabel} />;

  // Fallbacks for specific flags
  if (isLoggingOut) return <LoadingScreen label="Loggar ut" />;
  if (isLoggingIn) return <LoadingScreen label="Loggar in" />;

  // Implicit data loading (e.g. refreshLookups)
  if (isLoading) return <LoadingScreen />;

  return (
    <HashRouter>
      <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginPage />} />

          {/* Role-protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["Personal", "Admin"]}>
                <PersonalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["Brukare", "Personal", "Admin"]}>
                <BrukarePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Debug Tools */}
        <TokenInspector />
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
