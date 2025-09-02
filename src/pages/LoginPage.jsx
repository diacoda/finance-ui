/**
 * LoginPage.jsx
 *
 * Provides a login form for users to authenticate.
 * Features:
 * - Username and password inputs
 * - Auto-focus on username field
 * - Submit form via Enter key
 * - Disable submit button while logging in
 * - Error display for invalid credentials
 * - Authentication token stored via Auth context
 * - Redirect to home page upon successful login
 */

// src/pages/LoginPage.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Tracks login request

  const usernameRef = useRef(null);

  // Focus username input on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Disable button

    try {
      const res = await axios.post("https://localhost:5001/api/auth/login", {
        userName: username,
        password: password,
      });

      const token = res.data.token;
      login(token);
      navigate("/");
    } catch (err) {
      setPassword("");
      console.error(err);
      setError("Invalid login credentials");
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            ref={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading} // Button disabled while logging in
            className={`w-full py-2 px-4 rounded-md text-white transition
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
