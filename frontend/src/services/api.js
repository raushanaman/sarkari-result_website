import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//trying to fix the login isue
// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  createAdmin: (adminData) => api.post('/auth/create-admin', adminData),
};

export const jobsAPI = {
  getAllJobs: (category) => api.get(`/jobs${category ? `?category=${category}` : ''}`),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getAdminJobs: () => api.get('/jobs/admin/all'),
  getDeletionNotifications: () => api.get('/jobs/admin/deletion-notifications'),
  confirmDeletion: (jobIds) => api.post('/jobs/admin/confirm-deletion', { jobIds }),
  postponeDeletion: (jobIds, days) => api.post('/jobs/admin/postpone-deletion', { jobIds, days }),
};

export const youtubeAPI = {
  getYouTubeUpdate: () => api.get('/youtube'),
  updateYouTube: (data) => api.post('/youtube', data),
};

export default api;