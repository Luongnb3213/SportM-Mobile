// providers/AuthProvider.tsx
import { decodeJwt, JWTPayload } from '@/lib/jwt';
import { clearTokens, getTokens } from '@/lib/tokenStorage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'log_client' | 'log_owner';

type AuthContextValue = {
  status: AuthStatus;
  user: JWTPayload | null;
  setUser: React.Dispatch<React.SetStateAction<JWTPayload | null>>;
  refreshFromStorage: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<JWTPayload | null>(null);

  const refreshFromStorage = async () => {
    try {
      const token = await getTokens();
      if (!token) throw new Error('No token found');

      const payload = decodeJwt(token);
      if (!payload) throw new Error('Invalid token structure');

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
      }

      setUser(payload);
      if (payload.role === 'CLIENT') {
        setStatus('log_client');
      } else {
        setStatus('log_owner');
      }

    } catch (err) {
      console.log('Token decode error:', err);
      await clearTokens();
      setUser(null);
      setStatus('unauthenticated');
    }
  };


  const signOut = async () => {
    await clearTokens();
    setUser(null);
    setStatus('unauthenticated');
  };

  useEffect(() => {
    refreshFromStorage();
  }, []);

  const value = useMemo(
    () => ({ status, user, setUser, refreshFromStorage, signOut }),
    [status, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
