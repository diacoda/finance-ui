// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { authToken, isTokenExpired, logout } = useAuth();

  if (!authToken || isTokenExpired()) {
    logout(); // clear invalid token
    return <Navigate to="/login" replace />;
  }

  return children;
}
