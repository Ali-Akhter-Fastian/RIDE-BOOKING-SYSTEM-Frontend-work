import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { createRiderSocket } from '../services/websocket/riderSocket';
import { createDriverSocket } from '../services/websocket/driverSocket';

type SocketContextValue = {
  riderSocket: ReturnType<typeof createRiderSocket> | null;
  driverSocket: ReturnType<typeof createDriverSocket> | null;
};

const SocketContext = createContext<SocketContextValue>({ riderSocket: null, driverSocket: null });

export function SocketProvider({ userId, driverId, children }: { userId?: string; driverId?: string; children: ReactNode }) {
  const riderRef = useRef<ReturnType<typeof createRiderSocket> | null>(null);
  const driverRef = useRef<ReturnType<typeof createDriverSocket> | null>(null);

  useEffect(() => {
    if (userId) {
      riderRef.current = createRiderSocket(userId);
      riderRef.current.connect();
    }
    if (driverId) {
      driverRef.current = createDriverSocket(driverId);
      driverRef.current.connect();
    }
    return () => {
      riderRef.current?.disconnect();
      driverRef.current?.disconnect();
    };
  }, [userId, driverId]);

  return (
    <SocketContext.Provider value={{ riderSocket: riderRef.current, driverSocket: driverRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
