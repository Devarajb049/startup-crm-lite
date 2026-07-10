import axios from 'axios';
import { toast } from 'react-hot-toast';

// Helper to resolve the correct API base URL.
// When accessing the app from another device on the local network (e.g. via computer's IP),
// any hardcoded 'localhost' or '127.0.0.1' API endpoints would fail.
// This function dynamically swaps localhost/127.0.0.1 with the current network hostname.
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const { hostname, protocol } = window.location;

  if (envUrl) {
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      if (envUrl.includes('localhost')) {
        return envUrl.replace('localhost', hostname);
      }
      if (envUrl.includes('127.0.0.1')) {
        return envUrl.replace('127.0.0.1', hostname);
      }
    }
    return envUrl;
  }
  
  return `${protocol}//${hostname}:5000`;
};

// Create an Axios instance pointing to the dynamic API base URL
const api = axios.create({
  baseURL: getBaseURL(),
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
      // Redirect to hash-based login route unless already there
      if (window.location.hash !== '#/login') {
        window.location.href = '/#/login';
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
