import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/authentication/login";
import SignupPage from "@/pages/authentication/signup";
import Dashboard from "@/pages/dashboard";
import { useAuth } from "@/hooks/useAuth";
import JobListPage from "@/pages/job/JobListPage";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/jobs" element={<JobListPage />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />

      {/* Catch‑all: 404 or redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
