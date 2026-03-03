/**
 * Auth API - talks to Spring Boot backend (session-based).
 * Use proxy in development: "proxy": "http://localhost:8080" in package.json.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export async function login(username, password) {
  const { data } = await api.post('/login', { username, password });
  return data;
}

export async function register(username, password) {
  const { data } = await api.post('/register', { username, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get('/me');
  return data;
}

export async function logout() {
  await api.post('/logout');
}
