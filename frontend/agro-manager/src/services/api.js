import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Ajouter le token JWT automatiquement
api.interceptors.request.use((config) => {
  // Le token est stocké dans localStorage après la connexion
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;