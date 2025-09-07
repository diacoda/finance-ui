// tests/App.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthProvider';
import { AppContent } from '../../src/App';

// Helper to create a simple fake JWT
function createFakeToken(expiryInSeconds = 60) {
  const payload = { exp: Math.floor(Date.now() / 1000) + expiryInSeconds };
  return [
    btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    btoa(JSON.stringify(payload)),
    'signature',
  ].join('.');
}

describe('App integration', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  test('navigation bar only shows when logged in', () => {
    // Not logged in
    render(
      <AuthProvider>
        <MemoryRouter>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.queryByText('Market Summary')).not.toBeInTheDocument();

    // Logged in
    const token = createFakeToken();
    localStorage.setItem('authToken', token);

    render(
      <AuthProvider>
        <MemoryRouter>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Market Summary')).toBeInTheDocument();
    expect(screen.getByText('Prices')).toBeInTheDocument();
    expect(screen.getByText('Market History')).toBeInTheDocument();
  });

  test('redirects to login if not authenticated', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );

    // User is not logged in, so DatesPage protected route should redirect
    expect(screen.queryByText('Market Summary')).not.toBeInTheDocument();
    expect(screen.queryByText('Login')).toBeInTheDocument();
  });

  test('login page redirects to / if already logged in', () => {
    const token = createFakeToken();
    localStorage.setItem('authToken', token);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );

    // Already logged in, should redirect away from login page
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.getByText('Market Summary')).toBeInTheDocument();
  });

  test('logout button clears token and hides navigation', () => {
    const token = createFakeToken();
    localStorage.setItem('authToken', token);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );

    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(screen.queryByText('Market Summary')).not.toBeInTheDocument();
  });
});
