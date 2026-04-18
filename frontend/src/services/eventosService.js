import api from '../api/axios';

export const eventosService = {

  // ── Catálogo público ───────────────────────────────────────────────────────
  listarPublicos: async () => {
    const res = await api.get('/eventos');
    return res.data.eventos;
  },

  obtenerDetalle: async (idEvento) => {
    const res = await api.get(`/eventos/${idEvento}`);
    return res.data.evento;
  },

  obtenerZonas: async (idEvento) => {
    const res = await api.get(`/eventos/${idEvento}/zonas`);
    return res.data.zonas;
  },

  // ── Organizador ────────────────────────────────────────────────────────────
  misEventos: async () => {
    const res = await api.get('/eventos/organizador/mis-eventos');
    return res.data.eventos;
  },

  eventosHoy: async () => {
    const res = await api.get('/eventos/organizador/eventos-hoy');
    return res.data.eventos;
  },

  crear: async (datos) => {
    const res = await api.post('/eventos', datos);
    return res.data;
  },

  editar: async (idEvento, datos) => {
    const res = await api.put(`/eventos/${idEvento}`, datos);
    return res.data;
  },

  publicar: async (idEvento) => {
    const res = await api.put(`/eventos/${idEvento}/publicar`);
    return res.data;
  },

  cancelar: async (idEvento) => {
    const res = await api.put(`/eventos/${idEvento}/cancelar`);
    return res.data;
  },

  agregarZona: async (idEvento, zona) => {
    const res = await api.post(`/eventos/${idEvento}/zonas`, zona);
    return res.data;
  },

  editarZona: async (idZona, zona) => {
    const res = await api.put(`/eventos/zonas/${idZona}`, zona);
    return res.data;
  },

  eliminarZona: async (idZona) => {
    const res = await api.delete(`/eventos/zonas/${idZona}`);
    return res.data;
  },

  subirImagen: async (idEvento, formData) => {
    const res = await api.post(`/eventos/${idEvento}/imagenes`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Agrega esta función
    obtenerDetalleOrganizador: async (idEvento) => {
      const res = await api.get(`/eventos/organizador/${idEvento}`);
      return res.data.evento;
    },

  quitarImagen: async (idImagen) => {
    const res = await api.delete(`/eventos/imagenes/${idImagen}`);
    return res.data;
  },

  solicitarModificacion: async (idEvento, causa) => {
    const res = await api.post(`/eventos/${idEvento}/solicitar-modificacion`, { causa });
    return res.data;
  },

  solicitarCancelacion: async (idEvento, causa) => {
    const res = await api.post(`/eventos/${idEvento}/solicitar-cancelacion`, { causa });
    return res.data;
  },
};
