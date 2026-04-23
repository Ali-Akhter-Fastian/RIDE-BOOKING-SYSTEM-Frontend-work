import { useState, useCallback } from 'react';
import { rideApi } from '../api/rideApi';

export function useRide() {
  const [ride, setRide] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestRide = useCallback(async (payload: { pickup: { lat: number; lng: number }; dropoff: { lat: number; lng: number }; ride_type: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await rideApi.request(payload);
      setRide(data);
      return data;
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Failed to request ride');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelRide = useCallback(async (id: string) => {
    await rideApi.cancel(id);
    setRide(null);
  }, []);

  const updateStatus = useCallback(async (id: string, status: string) => {
    const { data } = await rideApi.updateStatus(id, status);
    setRide(data);
    return data;
  }, []);

  return { ride, loading, error, requestRide, cancelRide, updateStatus };
}
