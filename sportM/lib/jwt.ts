// jwt.ts
import { jwtDecode } from 'jwt-decode';

export type JWTPayload = {
  sub?: string;
  email?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [k: string]: any;
};

export function decodeJwt<T extends object = JWTPayload>(token: string): T | null {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}

export function isExpired(token?: string, skewSeconds = 10): boolean {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp - skewSeconds;
  } catch {
    return true;
  }
}
