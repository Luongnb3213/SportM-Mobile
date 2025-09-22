import * as SecureStore from 'expo-secure-store';

export type Tokens = {
  accessToken: string; // JWT
  refreshToken?: string; // JWT hoặc opaque
  // Tuỳ chọn: nếu BE trả về, lưu lại để proactive refresh mà KHÔNG cần decode
  expiresAt?: string; // ISO, ví dụ: new Date(Date.now()+55*60*1000).toISOString()
};

const KEY = 'authTokens';
let inMemory: Tokens | null = null; // giảm I/O cho interceptor

export async function saveTokens(tokens: Tokens) {
  inMemory = tokens;
  await SecureStore.setItemAsync(KEY, JSON.stringify(tokens));
}

export async function getTokens(): Promise<Tokens | null> {
  if (inMemory) return inMemory;
  const raw = await SecureStore.getItemAsync(KEY);
  inMemory = raw ? (JSON.parse(raw) as Tokens) : null;
  return inMemory;
}

export async function clearTokens() {
  inMemory = null;
  await SecureStore.deleteItemAsync(KEY);
}

export async function setAccessToken(accessToken: string, expiresAt?: string) {
  const current = (await getTokens()) ?? { accessToken };
  current.accessToken = accessToken;
  if (expiresAt) current.expiresAt = expiresAt;
  await saveTokens(current);
}
