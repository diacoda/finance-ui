// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { authToken, isTokenExpired } = useAuth();

  if (!authToken || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
