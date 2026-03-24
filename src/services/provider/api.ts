import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
  
    return Promise.reject(error);
  }
);

export default api;