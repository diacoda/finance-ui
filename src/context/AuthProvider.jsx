// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Simple JWT decode (no validation, just reads payload)
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.log("JWT parse error:", e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || null
  );

  // Derived state: is the token expired?
  const isTokenExpired = () => {
    if (!authToken) return true;
    const decoded = parseJwt(authToken);
    if (!decoded?.exp) return true;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  };

  const login = (token) => setAuthToken(token);
  const logout = () => setAuthToken(null);

  // Keep localStorage in sync
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  // Auto-logout exactly at expiry
  useEffect(() => {
    if (!authToken) return;

    const decoded = parseJwt(authToken);
    if (!decoded?.exp) return;

    const now = Date.now() / 1000;
    const expiresInMs = (decoded.exp - now) * 1000;

    if (expiresInMs <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, expiresInMs);

    return () => clearTimeout(timer);
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{ authToken, login, logout, isTokenExpired }}
    >
      {children}
    </AuthContext.Provider>
  );
};
