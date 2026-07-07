import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create an Axios instance pointing to the VITE_API_URL env variable or fallback
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request Interceptor: Automatically inject the Authorization header if JWT token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors such as unauthorized access or connection failures globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Session expired or Unauthorized (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('crm-token');
      // If HashRouter is used, redirect via hash; otherwise via path
      if (window.location.hash) {
        if (window.location.hash !== '#/login') {
          window.location.href = '/#/login';
        }
      } else {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } 
    // 2. Local network or connection failures (no response received)
    else if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'global-network-error', // Prevents toast notification spamming
      });
    }
    return Promise.reject(error);
  }
);

export default api;
