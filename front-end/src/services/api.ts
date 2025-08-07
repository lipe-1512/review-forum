// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Use a URL base do seu backend!
  headers: {
    'Content-Type': 'application/json',
  },
});



export default apiClient;