import { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import { createRiderSocket } from '../services/websocket/riderSocket';
import { createDriverSocket } from '../services/websocket/driverSocket';

type SocketContextValue = {
  riderSocket: ReturnType<typeof createRiderSocket> | null;
  driverSocket: ReturnType<typeof createDriverSocket> | null;
};

const SocketContext = createContext<SocketContextValue>({ riderSocket: null, driverSocket: null });

export function SocketProvider({ userId, driverId, children }: { userId?: string; driverId?: string; children: ReactNode }) {
  const [riderSocket, setRiderSocket] = useState<ReturnType<typeof createRiderSocket> | null>(null);
  const [driverSocket, setDriverSocket] = useState<ReturnType<typeof createDriverSocket> | null>(null);

  useEffect(() => {
    let mounted = true;
    if (userId) {
      const ws = createRiderSocket(userId);
      ws.connect();
      if (mounted) setRiderSocket(ws);
    }
    return () => {
      mounted = false;
      riderSocket?.disconnect();
      setRiderSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    if (driverId) {
      const ws = createDriverSocket(driverId);
      ws.connect();
      if (mounted) setDriverSocket(ws);
    }
    return () => {
      mounted = false;
      driverSocket?.disconnect();
      setDriverSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId]);

  return (
    <SocketContext.Provider value={{ riderSocket, driverSocket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
