// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/authentication/login";
import SignupPage from "@/pages/authentication/signup";
import Dashboard from "@/pages/dashboard";
import ResumeBuilderPage from "@/pages/resume-builder/ResumeBuilderPage";
import JobListPage from "./pages/job/JobListPage";
import ApplyJobPage from "@/pages/job/ApplyJobPage";
import { LogoutPage } from "@/pages/authentication/logout";
import ResumeBuilder from "@/pages/resume-builder/page";
import NotFound from "@/pages/misc/NotFound";
import Unauthorized from "./pages/misc/Unauthorized";
import {
  HRProtectedRoute,
  JobSeekerProtectedRoute,
} from "@/utils/ProtectedRoute";
import { AuthContext } from "@/hooks/context/AuthContext";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

  function RootRedirect() {
    const auth = useContext(AuthContext)!;

    if (auth.loading) {
      <div className="flex items-center justify-center h-screen">Loading…</div>;
    }

    if (!auth.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // If logged in and HR, go to dashboard
    if (auth.isHR) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/jobs" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      {/* AUTH */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* HR */}
      <Route element={<HRProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      {/* PUBLIC */}
      <Route element={<JobSeekerProtectedRoute />}>
        <Route
          path="/new-resume"
          element={
            isAuthenticated ? (
              <ResumeBuilder />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/builder/"
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
            isAuthenticated ? <JobListPage /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/jobs/:jobId/apply" element={<ApplyJobPage />} />
      </Route>
      {/* MISC */}
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
