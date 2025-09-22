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

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

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
    const tokens = await getTokens();
    const access = tokens?.accessToken;
    if (access) {
      const payload = decodeJwt(access);
      setUser(payload);
      setStatus('authenticated');
    } else {
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
