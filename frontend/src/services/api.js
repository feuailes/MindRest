import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindrest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mindrest_token');
      localStorage.removeItem('mindrest_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
