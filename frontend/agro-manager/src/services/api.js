import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // ou URL déployée

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});