import api from '../api/axios';

export const usuariosService = {

  perfil: async () => {
    const res = await api.get('/usuarios/perfil');
    return res.data.usuario;
  },

  misEventos: async () => {
    const res = await api.get('/usuarios/mis-eventos');
    return res.data.eventos;
  },

  eventosProximos: async () => {
    const res = await api.get('/usuarios/mis-eventos/proximos');
    return res.data.eventos;
  },

  misOrdenes: async () => {
  const res = await api.get('/usuarios/mis-ordenes');
  return res.data.ordenes;
},

  boletosPorOrden: async (idOrden) => {
    const res = await api.get(`/usuarios/mis-boletos/${idOrden}`);
    return res.data.boletos;
  },

  descargarBoleto: async (idBoleto) => {
    const res = await api.get(`/usuarios/boleto/${idBoleto}`);
    return res.data.boleto;
  },
};