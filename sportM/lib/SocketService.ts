// lib/SocketService.ts
import { io, Socket } from "socket.io-client";

type Listener = (...args: any[]) => void;

export type SocketServiceOptions = {
  url: string;                       // ví dụ: https://api.yourhost.com
  namespace?: string;                // ví dụ: "/ws"
  getToken?: () => Promise<string | null> | string | null; // trả token THUẦN (không kèm "Bearer ")
  reconnectionAttempts?: number;
  reconnectionDelay?: number;        // ms
  query?: Record<string, string | number | boolean>;
  extraHeaders?: Record<string, string>; // chỉ áp cho polling (không bắt buộc với BE hiện tại)
  autoConnect?: boolean;
};

export class SocketService {
  public socket?: Socket;
  private opts: SocketServiceOptions;
  private listeners = new Map<string, Set<Listener>>();

  constructor(options: SocketServiceOptions) {
    this.opts = {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true,
      ...options,
    };
    if (this.opts.autoConnect) void this.connect();
  }

  private async buildQueryWithToken() {
    const baseQuery = { ...(this.opts.query ?? {}) };
    const t =
      typeof this.opts.getToken === "function"
        ? await this.opts.getToken()
        : this.opts.getToken ?? null;
    if (t) (baseQuery as any).token = t; // <<<<<<  KHỚP BE: query.token
    // thêm ts để tránh cache khi reconnect
    (baseQuery as any).ts = Date.now();
    return baseQuery;
  }

  private async createSocket() {
    const {
      url,
      namespace,
      reconnectionAttempts,
      reconnectionDelay,
      extraHeaders,
    } = this.opts;

    const base = url.replace(/\/$/, "");
    const fullUrl = namespace ? `${base}${namespace}` : base;

    const initialQuery = await this.buildQueryWithToken();
    console.log("🌐 connecting to socket:", initialQuery);

    const s = io(fullUrl, {
      transports: ["websocket", "polling"],
      forceNew: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts,
      reconnectionDelay,
      query: initialQuery,
      transportOptions: {
        polling: {
          extraHeaders: {
            ...(extraHeaders ?? {}),
          },
        },
      },
    });

    this.socket = s;

    // Refresh token vào query trước mỗi lần reconnect attempt
    const ioManager: any = (s as any).io;
    if (ioManager && ioManager.on) {
      ioManager.on("reconnect_attempt", async () => {
        const newQuery = await this.buildQueryWithToken();
        if (ioManager.opts) {
          ioManager.opts.query = newQuery;
        }
      });
    }
  }

  async connect() {
    if (!this.socket) await this.createSocket();
    if (!this.socket!.connected) this.socket!.connect();
  }

  disconnect() {
    this.socket?.disconnect();
  }

  on(event: string, listener: Listener) {
    if (!this.socket) return;
    this.socket.on(event, listener);
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener) {
    this.socket?.off(event, listener);
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
      if (set.size === 0) this.listeners.delete(event);
    }
  }
}
