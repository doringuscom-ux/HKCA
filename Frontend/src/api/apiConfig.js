import axios from 'axios';

const isLocal = 'https://hkca.vercel.app/api'
// window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal
  ? 'https://hkca.vercel.app/api'
  // 'http://localhost:5000/api' 
  : (import.meta.env.VITE_API_URL || 'https://hkca.vercel.app/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
