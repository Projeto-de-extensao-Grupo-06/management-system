import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  // TODO ativar quando for usar integrado ao backend
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;