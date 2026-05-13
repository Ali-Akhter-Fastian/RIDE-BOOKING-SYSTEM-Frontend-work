const ACCESS_KEY = 'uc_access_token';
const REFRESH_KEY = 'uc_refresh_token';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setAccess: (token: string) => localStorage.setItem(ACCESS_KEY, token),
  setRefresh: (token: string) => localStorage.setItem(REFRESH_KEY, token),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
  hasTokens: () => !!localStorage.getItem(ACCESS_KEY),
};
