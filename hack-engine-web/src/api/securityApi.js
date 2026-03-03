import axios from 'axios';

const api = axios.create({
  baseURL: '/api/security',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export async function getSecurityLogs() {
  const { data } = await api.get('/logs');
  return data;
}

export async function getSecuritySummary() {
  const { data } = await api.get('/summary');
  return data;
}
