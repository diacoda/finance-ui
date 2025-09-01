// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Simple JWT decode (no validation, just reads payload)
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.log(e);
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
    if (!decoded || !decoded.exp) return true;
    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp < now;
  };

  useEffect(() => {
    if (authToken) localStorage.setItem("authToken", authToken);
    else localStorage.removeItem("authToken");
  }, [authToken]);

  const login = (token) => setAuthToken(token);
  const logout = () => setAuthToken(null);

  return (
    <AuthContext.Provider
      value={{ authToken, login, logout, isTokenExpired }}
    >
      {children}
    </AuthContext.Provider>
  );
};
