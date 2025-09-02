import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { AuthProvider } from '../../src/context/AuthProvider';

const Dashboard = () => <div>Dashboard</div>;

function createFakeToken(expiryInSeconds = 60) {
  const payload = { exp: Math.floor(Date.now() / 1000) + expiryInSeconds };
  return [
    btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    btoa(JSON.stringify(payload)),
    'signature'
  ].join('.');
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    localStorage.removeItem('authToken');
  });

  test('renders children when authenticated', () => {
    localStorage.setItem('authToken', createFakeToken());

    render(
      <AuthProvider>
        <MemoryRouter>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('redirects when not authenticated', () => {
    localStorage.removeItem('authToken');

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
