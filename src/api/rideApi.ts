import { client } from './client';

export const rideApi = {
  // POST /rides/request — triggers Workflow A (Driver Ranking) + B (Fare Prediction)
  request: (data: { pickup: { lat: number; lng: number }; dropoff: { lat: number; lng: number }; ride_type: string }) =>
    client.post('/rides/request', data),

  // GET /rides/{id}
  getById: (id: string) =>
    client.get(`/rides/${id}`),

  // PUT /rides/{id}/cancel
  cancel: (id: string) =>
    client.put(`/rides/${id}/cancel`),

  // PUT /rides/{id}/status — "completed" triggers Workflow C (Notifications)
  updateStatus: (id: string, status: string) =>
    client.put(`/rides/${id}/status`, { status }),

  // POST /rides/{id}/rate
  rate: (id: string, data: { rating: number; comment?: string }) =>
    client.post(`/rides/${id}/rate`, data),

  // GET /rides/history
  history: (params?: { page?: number; limit?: number }) =>
    client.get('/rides/history', { params }),
};
