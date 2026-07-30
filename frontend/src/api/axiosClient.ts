import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token to every outgoing request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aocs_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('aocs_token');
        localStorage.removeItem('aocs_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
