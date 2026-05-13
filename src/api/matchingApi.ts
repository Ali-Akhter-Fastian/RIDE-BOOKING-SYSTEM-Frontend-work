import { client } from './client';

export const matchingApi = {
  // POST /matching/find — calls Workflow A for AI-ranked driver list
  find: (ride_id: string) =>
    client.post('/matching/find', { ride_id }),

  // POST /matching/accept
  accept: (ride_id: string, driver_id: string) =>
    client.post('/matching/accept', { ride_id, driver_id }),

  // POST /matching/reject — re-triggers Workflow A with updated driver pool
  reject: (ride_id: string, driver_id: string) =>
    client.post('/matching/reject', { ride_id, driver_id }),

  // GET /matching/status/{ride_id} — polling fallback
  status: (ride_id: string) =>
    client.get(`/matching/status/${ride_id}`),
};
