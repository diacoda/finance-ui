// src/api/axiosInstance.js
import axios from "axios";

// Create a reusable axios instance with a base URL and optional timeout
const axiosInstance = axios.create({
  baseURL: "https://localhost:5001/api",
  timeout: 10000,
});

// Attach the auth token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request – logging out.");
      localStorage.removeItem("authToken");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
