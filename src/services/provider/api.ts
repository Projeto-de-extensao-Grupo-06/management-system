import axios from "axios";
import { useLoadingStore } from "../../store/useLoadingStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    (config as any)._shouldDecrement = true;
    useLoadingStore.getState().increment();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if ((response.config as any)._shouldDecrement) {
      useLoadingStore.getState().decrement();
    }
    return response;
  },
  (error) => {
    if (error.config?._shouldDecrement) {
      useLoadingStore.getState().decrement();
    }
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    const isLoginPage = window.location.pathname.includes('/login') || window.location.pathname === '/';
    const isForgetPasswordPage = window.location.pathname.includes('/esqueci-senha') || window.location.pathname === '/';

    if (error.response?.status === 401 && !isLoginPage && !isLoginRequest && !isForgetPasswordPage) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (error.response?.status === 500) {
      window.location.href = '/internal-server-error';
    }

    if (error.response?.status === 501) {
      window.location.href = '/not-implemented';
    }

    if (error.response?.status === 502) {
      window.location.href = '/bad-gateway';
    }

    if (error.response?.status === 503) {
      window.location.href = '/service-unavailable';
    }

    if (error.response?.status === 504) {
      window.location.href = '/gateway-timeout';
    }

    return Promise.reject(error);
  }
);

export default api;