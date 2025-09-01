import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Entry point: create a React root and render the App component
// StrictMode is used in development to highlight potential issues

//Notes:
// StrictMode helps catch React warnings during development.
// createRoot is the modern way in React 18+ to render your app.
// App is where all pages and routing are defined.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* The root component that contains routing and context */}
  </StrictMode>,
)
