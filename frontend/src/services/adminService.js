import api from '../api/axios';

export const adminService = {

  // ── Usuarios ───────────────────────────────────────────────────────────────
  listarUsuarios: async () => {
    const res = await api.get('/admin/usuarios');
    return res.data.usuarios;
  },

  usuariosPendientes: async () => {
    const res = await api.get('/admin/usuarios/pendientes');
    return res.data.usuarios;
  },

  verificarUsuario: async (idUsuario, aprobado, motivo) => {
    const res = await api.put(`/admin/usuarios/${idUsuario}/verificar`, { aprobado, motivo });
    return res.data;
  },

  desactivarUsuario: async (idUsuario) => {
    const res = await api.put(`/admin/usuarios/${idUsuario}/desactivar`);
    return res.data;
  },

  // ── Eventos ────────────────────────────────────────────────────────────────
  listarEventos: async () => {
    const res = await api.get('/admin/eventos');
    return res.data.eventos;
  },

  eventosNoPagados: async () => {
    const res = await api.get('/admin/eventos/no-pagados');
    return res.data.eventos;
  },

  marcarPagado: async (idEvento, cantidadDepositada) => {
    const res = await api.put(`/admin/eventos/${idEvento}/marcar-pagado`, { cantidadDepositada });
    return res.data;
  },

  // ── Imágenes ───────────────────────────────────────────────────────────────
  imagenesPendientes: async () => {
    const res = await api.get('/admin/imagenes/pendientes');
    return res.data.imagenes;
  },

  revisarImagen: async (idImagen, accion, motivo) => {
    const res = await api.put(`/admin/imagenes/${idImagen}/revisar`, { accion, motivo });
    return res.data;
  },

  // ── Solicitudes ────────────────────────────────────────────────────────────
  solicitudesPendientes: async () => {
    const res = await api.get('/admin/solicitudes/pendientes');
    return res.data.solicitudes;
  },

  resolverSolicitud: async (idSolicitud, aprobado) => {
    const res = await api.put(`/admin/solicitudes/${idSolicitud}/resolver`, { aprobado });
    return res.data;
  },

  // ── Finanzas ───────────────────────────────────────────────────────────────
  buscarOrden: async (filtros = {}) => {
    const res = await api.get('/admin/ordenes/buscar', { params: filtros });
    return res.data.ordenes;
  },

  obtenerDetalleEvento: async (idEvento) => {
  const res = await api.get(`/admin/eventos/${idEvento}/detalle`);
  return res.data.evento;
},

// ── Admins ─────────────────────────────────────────────────────────────────
listarAdmins: async () => {
  const res = await api.get('/admin/admins');
  return res.data.admins;
},

registrarAdmin: async (nombre, correo, contrasena) => {
  const res = await api.post('/admin/admins', { nombre, correo, contrasena });
  return res.data;
},

desactivarAdmin: async (idAdmin) => {
  const res = await api.put(`/admin/admins/${idAdmin}/desactivar`);
  return res.data;
},

buscarUsuarioParaAdmin: async (correo) => {
  const res = await api.get('/admin/usuarios/buscar-para-admin', { params: { correo } });
  return res.data.usuario;
},

promoverUsuarioAAdmin: async (idUsuario, contrasena) => {
  const res = await api.post('/admin/admins/promover', { idUsuario, contrasena });
  return res.data;
},

desactivarAdmin: async (idAdmin, motivo) => {
  const res = await api.put(`/admin/admins/${idAdmin}/desactivar`, { motivo });
  return res.data;
},

reactivarAdmin: async (idAdmin) => {
  const res = await api.put(`/admin/admins/${idAdmin}/reactivar`);
  return res.data;
},

};