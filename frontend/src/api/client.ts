import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
