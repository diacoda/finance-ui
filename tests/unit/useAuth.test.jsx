import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../../src/context/AuthProvider';
import { useAuth } from '../../src/context/useAuth';

// Helper to create a valid fake JWT with future expiry
function createFakeToken(expiryInSeconds = 60) {
  const payload = { exp: Math.floor(Date.now() / 1000) + expiryInSeconds };
  return [
    btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })), // header
    btoa(JSON.stringify(payload)),                       // payload
    'signature'                                          // signature (dummy)
  ].join('.');
}

describe('useAuth hook', () => {
  afterEach(() => localStorage.removeItem('authToken'));

  test('login and logout update authToken without JWT errors', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Use a valid fake JWT
    const token = createFakeToken();
    act(() => result.current.login(token));
    expect(result.current.authToken).toBe(token);

    act(() => result.current.logout());
    expect(result.current.authToken).toBeNull();
  });

  test('isTokenExpired returns true when no token', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isTokenExpired()).toBe(true);
  });

  test('isTokenExpired returns false for valid token', () => {
    const token = createFakeToken(60); // expires in 60 seconds
    localStorage.setItem('authToken', token);

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isTokenExpired()).toBe(false);
  });
  
  test('auto-logout works after token expiry', () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Set token with 1 second expiry
    const token = createFakeToken(1);
    act(() => {
      result.current.login(token);
    });

    expect(result.current.authToken).toBe(token);

    // Advance time by 2 seconds to expire token
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // React state should flush inside act
    expect(result.current.authToken).toBeNull();

    vi.useRealTimers();
  });
});
