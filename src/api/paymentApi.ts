import { client } from './client';

export const paymentApi = {
  // POST /payments/initiate — uses surge fare from Workflow B
  initiate: (data: { ride_id: string; method_id: string; amount: number }) =>
    client.post('/payments/initiate', data),

  // POST /payments/confirm — triggers Workflow C receipt dispatch
  confirm: (payment_id: string) =>
    client.post('/payments/confirm', { payment_id }),

  // POST /payments/refund
  refund: (payment_id: string, amount?: number) =>
    client.post('/payments/refund', { payment_id, amount }),

  // GET /payments/history
  history: (params?: { page?: number; limit?: number }) =>
    client.get('/payments/history', { params }),

  // POST /payments/methods
  addMethod: (data: { token: string; type: 'card' | 'wallet' }) =>
    client.post('/payments/methods', data),

  // DELETE /payments/methods/{id}
  removeMethod: (id: string) =>
    client.delete(`/payments/methods/${id}`),
};
