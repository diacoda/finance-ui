import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider"; // Provides authentication context
import { useAuth } from "./context/useAuth"; // Custom hook to access auth functions

// Import all page components
import DatesPage from "./pages/DatesPage";
import MarketSummaryPage from "./pages/MarketSummaryPage";
import PricesByDatePage from "./pages/PricesByDatePage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Wrapper to protect routes

function AppContent() {
  const { logout } = useAuth(); // access logout function from auth context

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Nav Links */}
            <div className="flex space-x-8">
              {[
                { name: "Market Summary", to: "/" },
                { name: "Prices", to: "/prices" },
                { name: "Market History", to: "/history" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive ? "text-indigo-400 bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-700"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Logout Button */}
            <div className="flex items-center">
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with routing */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <Routes>
          {/* Home: DatesPage, protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DatesPage />
              </ProtectedRoute>
            }
          />

          {/* Market Summary page for a specific date */}
          <Route
            path="/summary/:date"
            element={
              <ProtectedRoute>
                <MarketSummaryPage />
              </ProtectedRoute>
            }
          />

          {/* Prices by date page */}
          <Route
            path="/prices"
            element={
              <ProtectedRoute>
                <PricesByDatePage />
              </ProtectedRoute>
            }
          />

          {/* History page */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Login page (public) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

// Root App component wraps the content with authentication context and router
export default function App() {
  return (
    <AuthProvider> {/* Provides authentication state to all components */}
      <Router> {/* React Router for SPA routing */}
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
