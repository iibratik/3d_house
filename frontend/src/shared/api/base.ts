import axios from 'axios';

const username = 'chuchmek';
const password = 'chuchmek';
const token = btoa(`${username}:${password}`); // base64 кодировка

export const $api = axios.create({
  baseURL: 'http://localhost:8000/', // измени на нужный порт, у тебя был 8080
  headers: {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json',
  },
  withCredentials: true
});