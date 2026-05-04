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
  register: (data: {
    nama: string;
    email: string;
    password: string;
    role: string;
    alamat: string;
  }) => api.post("/users/register", data),
  getUsers: () => api.get("/users"),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUser: (
    id: string,
    data: { nama: string; email: string; alamat?: string },
  ) => api.put(`/users/${id}`, data),
  changePassword: (
    id: string,
    data: { passwordLama: string; passwordBaru: string },
  ) => api.post(`/users/${id}/change-password`, data),
};

// API endpoints untuk Hasil Panen (Petani)
export const panenAPI = {
  create: (data: any) => api.post('/panen', data),
  getAll: () => api.get('/panen'),
  getGradeC: () => api.get('/panen/grade-c'),
  getRecovery: () => api.get('/panen/recovery'),
  getById: (id: string) => api.get(`/panen/${id}`),
  update: (id: string, data: any) => api.put(`/panen/${id}`, data),
  updateRecovery: (id: string, data: any) => api.put(`/panen/${id}/recovery`, data),
  delete: (id: string) => api.delete(`/panen/${id}`),
};

// API endpoints untuk Permintaan (Pedagang)
export const permintaanAPI = {
  create: (data: any) => api.post('/permintaan', data),
  getAll: () => api.get('/permintaan'),
  getById: (id: string) => api.get(`/permintaan/${id}`),
  match: (id: string, matchData: any) => api.post(`/permintaan/match/${id}`, matchData),
  konfirmasi: (id: string, tindakan: 'setuju' | 'batal') => api.put(`/permintaan/konfirmasi/${id}`, { tindakan }),
};

// API endpoints untuk Weather
// src/services/api.ts
export const weatherAPI = {
  get: (city: string) => api.get(`/weather?city=${city}`), 
};

// API endpoints untuk Chat
export const chatAPI = {
  getChatList: (userId: string) => api.get(`/chat/list/${userId}`),
  getChatMessages: (userId: string, contactId: string) => api.get(`/chat/messages/${userId}/${contactId}`),
  sendMessage: (senderId: string, receiverId: string, pesan: string) => api.post('/chat/send', { sender_id: senderId, receiver_id: receiverId, pesan }),
  getUnreadCount: (userId: string) => api.get(`/chat/unread/${userId}`),
};

export default api;
