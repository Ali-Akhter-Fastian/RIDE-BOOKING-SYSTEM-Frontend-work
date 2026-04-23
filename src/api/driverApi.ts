import { client } from './client';

export const driverApi = {
  // POST /drivers/register
  register: (data: { vehicle: object; license_number: string; documents: object }) =>
    client.post('/drivers/register', data),

  // GET /drivers/{id}
  getById: (id: string) =>
    client.get(`/drivers/${id}`),

  // PUT /drivers/{id}/status
  setStatus: (id: string, status: 'online' | 'offline' | 'busy') =>
    client.put(`/drivers/${id}/status`, { status }),

  // PUT /drivers/location — GPS ping every ~5s; feeds Workflow A driver pool
  updateLocation: (lat: number, lng: number) =>
    client.put('/drivers/location', { lat, lng }),

  // GET /drivers/nearby — input for Workflow A ranking payload
  nearby: (lat: number, lng: number, radius_km = 5) =>
    client.get('/drivers/nearby', { params: { lat, lng, radius_km } }),

  // GET /drivers/{id}/earnings
  earnings: (id: string, params?: { from?: string; to?: string }) =>
    client.get(`/drivers/${id}/earnings`, { params }),
};
