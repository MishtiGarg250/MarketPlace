
export const uploadProductImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  // Use axios directly to set multipart headers
  const raw = localStorage.getItem('auth');
  const headers: Record<string, string> = { 'Content-Type': 'multipart/form-data' };
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch(err){
      console.log(err)
    }
  }
  const res = await api.post('/products/upload', formData, { headers });
  return res.data;
};

export const addFavorite = (productId: string) => api.post('/users/favorites/add', { productId });
export const removeFavorite = (productId: string) => api.post('/users/favorites/remove', { productId });
export const getFavorites = () => api.get('/users/favorites');
import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
}); 

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
    } catch (error){
      console.log(error)
    }
  }
  return config;
});

export default api;