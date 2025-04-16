import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
