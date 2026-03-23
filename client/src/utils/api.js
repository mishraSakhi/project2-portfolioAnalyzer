import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const fetchProfile = async (username) => {
  const { data } = await api.get(`/profile/${username}`);
  return data;
};

export const fetchCachedProfile = async (username) => {
  const { data } = await api.get(`/profile/${username}/cached`);
  return data;
};

export const compareProfiles = async (u1, u2) => {
  const { data } = await api.get(`/compare?u1=${u1}&u2=${u2}`);
  return data;
};

export default api;
