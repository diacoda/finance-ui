// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/useAuth";

// Pages
import DatesPage from "./pages/DatesPage";
import MarketSummaryPage from "./pages/MarketSummaryPage";
import PricesByDatePage from "./pages/PricesByDatePage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import AccountsExplorerPage from "./pages/AccountsExplorerPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import MarketOverviewPage from "./pages/MarketOverviewPage";

function AppContent() {
  const { authToken, logout } = useAuth();

  return (
    <>
      {/* Navigation Bar (only when logged in) */}
      {authToken && (
        <nav className="bg-gray-900 shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              {/* Nav Links */}
              <div className="flex space-x-8">
                {[
                  { name: "Market Summary", to: "/" },
                  { name: "Prices", to: "/prices" },
                  { name: "Market History", to: "/history" },
                  { name: "Market Overview", to: "/overview" },
                  { name: "Accounts Explorer", to: "/accounts-explorer" },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "text-indigo-400 bg-gray-800"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`
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
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <MarketOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary/:date"
            element={
              <ProtectedRoute>
                <MarketSummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prices"
            element={
              <ProtectedRoute>
                <PricesByDatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts-explorer"
            element={
              <ProtectedRoute>
                <AccountsExplorerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/:accountName"
            element={
              <ProtectedRoute>
                <AccountDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Login page (redirects to / if already logged in) */}
          <Route
            path="/login"
            element={authToken ? <Navigate to="/" replace /> : <LoginPage />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export { AppContent };
