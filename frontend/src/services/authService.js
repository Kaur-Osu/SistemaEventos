import api from '../api/axios';

export const authService = {

  login: async (correo, contrasena) => {
    const res = await api.post('/auth/login', { correo, contrasena });
    return res.data; // { ok, token, usuario }
  },
  me: async () => {
    const res = await api.get('/auth/me');
    return res.data.usuario; // { ok, usuario }
  },
  loginAdmin: async (correo, contrasena) => {
    const res = await api.post('/auth/admin/login', { correo, contrasena });
    return res.data;
  },

  registro: async ({ nombre, correo, contrasena }) => {
    const res = await api.post('/auth/registro', { nombre, correo, contrasena });
    return res.data;
  },

  cambiarContrasena: async (contrasenaActual, contrasenaNueva) => {
    const res = await api.put('/auth/cambiar-contrasena', { contrasenaActual, contrasenaNueva });
    return res.data;
  },

  reenviarVerificacion: async () => {
    const res = await api.post('/auth/reenviar-verificacion');
    return res.data;
  },

  recuperarContrasena: async (correo) => {
    const res = await api.post('/auth/recuperar-contrasena', { correo });
    return res.data;
  },

  restablecerContrasena: async (token, nuevaContrasena) => {
    const res = await api.post(`/auth/restablecer-contrasena/${token}`, { nuevaContrasena });
    return res.data;
  },

  // Enviar documentos para ser organizador (multipart/form-data)
  verificarse: async (formData) => {
    const res = await api.post('/auth/verificarse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};