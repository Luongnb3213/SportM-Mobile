import * as SecureStore from 'expo-secure-store';

const CREDS_KEY = 'credentials';

export const saveCredentials = async (email: string, password: string) => {
  await SecureStore.setItemAsync(CREDS_KEY, JSON.stringify({ email, password }));
};

export const getCredentials = async () => {
  const data = await SecureStore.getItemAsync(CREDS_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearCredentials = async () => {
  await SecureStore.deleteItemAsync(CREDS_KEY);
};
