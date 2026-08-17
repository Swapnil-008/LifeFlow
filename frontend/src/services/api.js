import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // Required because both JWT cookies are HttpOnly and must be sent by the browser.
  withCredentials: true,
});

let refreshPromise = null;

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/logout')
    ) {
      originalRequest._retry = true;

      try {
        // The refresh token is an HttpOnly cookie. The browser sends it
        // automatically; JavaScript never reads either JWT.
        await refreshSession();
        return api(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new Event('dailylife:auth-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
