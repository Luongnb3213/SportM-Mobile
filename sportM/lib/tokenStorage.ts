import * as SecureStore from 'expo-secure-store';


export async function saveTokens(KEY: string, tokens: any) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(tokens));
}

export async function getTokens(): Promise<any | null> {
  const raw = await SecureStore.getItemAsync("accessToken");
  return raw ? (JSON.parse(raw)) : null;
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync("accessToken");
}

export async function setAccessToken(accessToken: string, expiresAt?: string) {
  const current = (await getTokens()) ?? { accessToken };
  current.accessToken = accessToken;
  if (expiresAt) current.expiresAt = expiresAt;
  await saveTokens('accessToken', current);
}
