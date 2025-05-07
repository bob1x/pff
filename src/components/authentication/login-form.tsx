// src/hooks/useLogin.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // pull in both the login fn and the booleans you added
  const { login, isHR, isJobSeeker } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ok = await login(email, password);
    if (ok) {
      // HR and admin → dashboard
      if (isHR) {
        navigate("/dashboard", { replace: true });
      }
      // everyone else → home (or wherever you want)
      else 
      if (isJobSeeker) {
        navigate("/jobs", { replace: true });
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  };
}
