// useSocketEvent.ts
import { SocketService } from "@/lib/SocketService";
import { useEffect } from "react";

/** Tự đăng ký/huỷ đăng ký event theo vòng đời component */
export function useSocketEvent(
  socket: SocketService | null | undefined,
  event: string,
  handler: (...args: any[]) => void
) {
  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [socket, event, handler]);
}
