// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor
api.interceptors.request.use(
  (config) => {
    // For example, attach auth token if you have one
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global API errors
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default api;
