import api from '../api/axios';

export const ordenesService = {

  crear: async (idEvento, idZona, cantidad) => {
    const res = await api.post('/ordenes', { idEvento, idZona, cantidad });
    return res.data; // { idOrden, precioPorBoleto, total, expiracion }
  },

  pagar: async (idOrden, cantidadPagada) => {
    const res = await api.post(`/ordenes/${idOrden}/pagar`, { cantidadPagada });
    return res.data;
  },

  detalle: async (idOrden) => {
    const res = await api.get(`/ordenes/${idOrden}`);
    return res.data.orden;
  },

  recibo: async (idOrden) => {
    const res = await api.get(`/ordenes/${idOrden}/recibo`);
    return res.data.recibo;
  },
};