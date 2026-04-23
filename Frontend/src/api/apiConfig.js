import axios from 'axios';

const isLocal = 'https://hkca.onrender.com/api'
// window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal
  ? 'https://hkca.onrender.com/api'
  // 'http://localhost:5000/api' 
  : (import.meta.env.VITE_API_URL || 'https://hkca.onrender.com/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
