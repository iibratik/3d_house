import axios from 'axios';

const username = 'chuchmek';
const password = 'chuchmek';
const token = btoa(`${username}:${password}`); // base64 кодировка

export const $api = axios.create({
  baseURL: '/api/back', // ✅ точно как в Swagger: /api/back
  headers: {
    'Authorization': `Basic ${token}`,       // 🔐 Basic Auth
    'Content-Type': 'application/json',      // 📦 JSON
  },
  withCredentials: true // ✅ если backend работает с куками или сессиями
});
