import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import PersonalPage from './pages/staff/PersonalPage';
import BrukarePage from './pages/user/BrukarePage';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleGate } from './components/RoleGate';
import { TokenInspector } from './components/TokenInspector';

/**
 * A component to protect routes based on authentication and roles
 */
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: ("Admin" | "Personal" | "Brukare")[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <RoleGate allowedRoles={allowedRoles} fallback={<Navigate to="/" replace />}>
      {children}
    </RoleGate>
  );
};

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="absolute -bottom-32 -right-10 h-96 w-96 rounded-full bg-purple-500/20 blur-[140px]" />
      <div className="relative z-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl shadow-2xl">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <div className="text-sm uppercase tracking-[0.2em] text-slate-200">Loading session</div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();

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
