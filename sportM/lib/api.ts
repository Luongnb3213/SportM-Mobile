import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getTokens, saveTokens, clearTokens } from './tokenStorage';

const BASE_URL = 'https://sportmbe.onrender.com';
const REFRESH_URL = '/auth/refresh';

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
};

let api: AxiosInstance | null = null;

// ---- Single-flight refresh queue ----
let isRefreshing = false;
let queue: {
  config: AxiosRequestConfig;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}[] = [];

function enqueue(config: AxiosRequestConfig) {
  return new Promise((resolve, reject) =>
    queue.push({ config, resolve, reject })
  );
}

function flush(error: any, token?: string) {
  const pending = [...queue];
  queue = [];
  pending.forEach(({ config, resolve, reject }) => {
    if (error) return reject(error);
    config.headers = {
      ...(config.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    };
    resolve(axios(config));
  });
}
async function callRefresh(refreshToken: string) {
  const base = axios.create({ baseURL: BASE_URL }); // tránh interceptor đệ quy
  const { data } = await base.post<RefreshResponse>(REFRESH_URL, {
    refreshToken,
  });
  return data;
}

export function getApi(): AxiosInstance {
  if (api) return api;
  api = axios.create({ baseURL: BASE_URL, timeout: 5000 });

  // --- Request: chỉ cần gắn access token hiện có ---
  api.interceptors.request.use(async (config) => {
    const tokens = await getTokens();
    if (tokens?.accessToken) {
      if (config.headers) {
        config.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      }
    }
    return config;
  });

  // --- Response: xử lý 401 để refresh và retry ---
  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config!;
      if (error.response?.status !== 401) throw error;

      // @ts-expect-error: tránh vòng lặp vô hạn
      if (original._retry) throw error;
      // @ts-expect-error
      original._retry = true;

      const tokens = await getTokens();
      const refresh = tokens?.refreshToken;
      if (!refresh) {
        await clearTokens();
        throw error; // để UI điều hướng login
      }

      if (isRefreshing) {
        return enqueue(original);
      }

      isRefreshing = true;
      try {
        const next = await callRefresh(refresh);
        await saveTokens('accessToken', { accessToken: next.accessToken });
        const fresh = next.accessToken;
        if (original.headers) {
          original.headers.set('Authorization', `Bearer ${fresh}`);
        }
        flush(null, fresh);
        return axios(original);
      } catch (err) {
        flush(err);
        await clearTokens();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
  );

  return api;
}

export const useAxios = getApi();
