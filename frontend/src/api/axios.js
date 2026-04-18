import axios from 'axios';

const api = axios.create({
  baseURL : import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  timeout : 12000,
  headers : { 'Content-Type': 'application/json' },
});

// ── Inyectar JWT en cada petición ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_eventos');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Manejar errores globalmente ───────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token_eventos');
      localStorage.removeItem('usuario_eventos');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Normalizar el mensaje de error para que los servicios puedan lanzarlo directamente
    const mensaje = error.response?.data?.mensaje ?? error.message ?? 'Error de conexión';
    return Promise.reject(new Error(mensaje));
  }
);

export default api;