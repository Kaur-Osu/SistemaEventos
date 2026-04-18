const usuariosService = require('../services/usuarios.service');
const { ok } = require('../utils/response');

const obtenerPerfilCtrl = async (req, res, next) => {
  try {
    const data = await usuariosService.obtenerPerfil(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};

const obtenerPerfilPublicoCtrl = async (req, res, next) => {
  try {
    const data = await usuariosService.obtenerPerfilPublico(
      parseInt(req.params.idUsuario)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const obtenerEventosCompradosCtrl = async (req, res, next) => {
  try {
    const data = await usuariosService.obtenerEventosComprados(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};

const obtenerEventosProximosCtrl = async (req, res, next) => {
  try {
    const data = await usuariosService.obtenerEventosProximos(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};

const obtenerBoletosPorOrdenCtrl = async (req, res, next) => {
  try {
    const data = await usuariosService.obtenerBoletosPorOrden(
      req.user.idUsuario,
      parseInt(req.params.idOrden)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const descargarBoletoCtrl = async (req, res, next) => {
  try {
    const data = await usuariosService.descargarBoleto(
      req.user.idUsuario,
      parseInt(req.params.idBoleto)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const misOrdenesCtrl = async (req, res, next) => {
  try {
    const data = await usuariosService.obtenerOrdenes(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};

module.exports = {
  obtenerPerfilCtrl,
  obtenerPerfilPublicoCtrl,
  obtenerEventosCompradosCtrl,
  obtenerEventosProximosCtrl,
  obtenerBoletosPorOrdenCtrl,
  descargarBoletoCtrl,
  misOrdenesCtrl,
};