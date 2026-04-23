import { client } from './client';

export const authApi = {
  // POST /auth/register
  register: (data: { email?: string; phone?: string; name: string; role: string; password: string }) =>
    client.post('/auth/register', data),

  // POST /auth/login
  login: (data: { email?: string; phone?: string; password: string }) =>
    client.post('/auth/login', data),

  // POST /auth/verify-otp
  verifyOtp: (data: { phone: string; otp: string }) =>
    client.post('/auth/verify-otp', data),

  // POST /auth/refresh
  refreshToken: (refresh_token: string) =>
    client.post('/auth/refresh', { refresh_token }),

  // GET /auth/me
  me: () =>
    client.get('/auth/me'),

  // POST /auth/logout
  logout: () =>
    client.post('/auth/logout'),
};
