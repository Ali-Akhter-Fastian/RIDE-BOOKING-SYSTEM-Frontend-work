import { useEffect, useRef } from 'react';
import { driverApi } from '../api/driverApi';
import { useGeolocation } from './useGeolocation';

// Continuously pings PUT /drivers/location every 5s while driver is online
export function useDriverLocation(isOnline: boolean) {
  const { coords, error } = useGeolocation(true); // watch mode
  const coordsRef = useRef(coords);
  coordsRef.current = coords;

  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      const c = coordsRef.current;
      if (c) driverApi.updateLocation(c.lat, c.lng).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnline]);

  return { coords, error };
}
