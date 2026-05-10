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

  // PATCH /api/driver/status — set driver availability (online/offline)
  setAvailability: (is_available: boolean) =>
    client.patch('/api/driver/status', { is_available }),

  // DELETE /api/driver/locations — clear stored driver locations
  deleteLocations: () => client.delete('/api/driver/locations'),

  // POST /api/driver/save-location — stores current driver coordinates
  updateLocation: (lat: number, lng: number) =>
    client.post('/api/driver/save-location', { latitude: lat, longitude: lng }),

  // GET /drivers/nearby — input for Workflow A ranking payload
  nearby: (lat: number, lng: number, radius_km = 5) =>
    client.get('/drivers/nearby', { params: { lat, lng, radius_km } }),

  // GET /drivers/{id}/earnings
  earnings: (id: string, params?: { from?: string; to?: string }) =>
    client.get(`/drivers/${id}/earnings`, { params }),

  // GET /api/driver/active-request
  activeRequest: () => client.get('/api/driver/active-request'),
};
