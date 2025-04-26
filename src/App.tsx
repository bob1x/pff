// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/authentication/login";
import SignupPage from "@/pages/authentication/signup";
import Dashboard from "@/pages/dashboard";
import ResumeBuilderPage from "@/pages/resume-builder/ResumeBuilderPage";
import JobListPage from "./pages/job/JobListPage";
export default function App() {
  const { isAuthenticated, loading } = useAuth();

  // While we’re rehydrating, don’t render any routes (or show a spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/builder/:id"
        element={
          isAuthenticated ? (
            <ResumeBuilderPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/jobs"
        element={
          isAuthenticated ? (
            <JobListPage/>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
