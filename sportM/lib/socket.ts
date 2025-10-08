// lib/socket.ts
import * as SecureStore from 'expo-secure-store';
import { SocketService } from './SocketService';
import { getTokens } from './tokenStorage';

export const socket = new SocketService({
  url: 'https://sportmbe.onrender.com', // ĐỔI domain API thật
  namespace: '/ws',                 // KHỚP @WebSocketGateway({ namespace: '/ws' })
  autoConnect: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  getToken: async () => {
    // trả token THUẦN (không có 'Bearer ')
    return (await getTokens()) ?? null;
  },
  query: { app: 'sportm' },         // tuỳ chọn
});
