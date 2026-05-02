import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints untuk User/Auth
export const authAPI = {
  register: (data: { nama: string; email: string; password: string; role: string }) =>
    api.post('/users/register', data),
  getUsers: () => api.get('/users'),
  updateUser: (id: string, data: { nama: string; email: string }) =>
    api.put(`/users/${id}`, data),
  changePassword: (id: string, data: { passwordLama: string; passwordBaru: string }) =>
    api.post(`/users/${id}/change-password`, data),
};

// API endpoints untuk Hasil Panen (Petani)
export const panenAPI = {
  create: (data: any) => api.post('/panen', data),
  getAll: () => api.get('/panen'),
  getById: (id: string) => api.get(`/panen/${id}`),
  update: (id: string, data: any) => api.put(`/panen/${id}`, data),
  delete: (id: string) => api.delete(`/panen/${id}`),
};

// API endpoints untuk Permintaan (Pedagang)
export const permintaanAPI = {
  create: (data: any) => api.post('/permintaan', data),
  getAll: () => api.get('/permintaan'),
  getById: (id: string) => api.get(`/permintaan/${id}`),
  match: (id: string, matchData: any) => api.post(`/permintaan/match/${id}`, matchData),
};

// API endpoints untuk Weather
export const weatherAPI = {
  get: () => api.get('/weather'),
};

export default api;
