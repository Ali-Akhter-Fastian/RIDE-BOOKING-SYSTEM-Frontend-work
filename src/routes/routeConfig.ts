import { ROLES } from '../constants/roles';

export const ROUTES = {
  LOGIN:          '/login',
  REGISTER:       '/register',

  // Rider
  RIDER_HOME:     '/rider',
  RIDER_MATCHING: '/rider/matching',
  RIDER_ACTIVE:   '/rider/active',
  RIDER_COMPLETE: '/rider/complete',
  RIDER_HISTORY:  '/rider/history',
  RIDER_PAYMENTS: '/rider/payments',

  // Driver
  DRIVER_HOME:    '/driver',
  DRIVER_ACTIVE:  '/driver/active',
  DRIVER_EARNINGS:'/driver/earnings',
  DRIVER_PROFILE: '/driver/profile',

  // Admin
  ADMIN_DASHBOARD:'/admin',
  ADMIN_RIDES:    '/admin/rides',
  ADMIN_USERS:    '/admin/users',
  ADMIN_ANALYTICS:'/admin/analytics',
  ADMIN_FRAUD:    '/admin/fraud',
} as const;

export const ROUTE_ROLES: Record<string, string[]> = {
  [ROUTES.RIDER_HOME]:      [ROLES.RIDER],
  [ROUTES.DRIVER_HOME]:     [ROLES.DRIVER],
  [ROUTES.ADMIN_DASHBOARD]: [ROLES.ADMIN],
};
