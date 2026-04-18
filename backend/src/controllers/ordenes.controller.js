const ordenesService = require('../services/ordenes.service');
const { ok, created } = require('../utils/response');

const crearOrdenCtrl = async (req, res, next) => {
  try {
    const { idEvento, idZona, cantidad } = req.body;

    if (!idEvento || !idZona || !cantidad) {
      return res.status(400).json({
        ok: false,
        mensaje: 'idEvento, idZona y cantidad son obligatorios.',
      });
    }

    if (cantidad < 1 || cantidad > 10) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Solo puedes comprar entre 1 y 10 boletos por orden.',
      });
    }

    const data = await ordenesService.crearOrden(
      req.user.idUsuario,
      parseInt(idEvento),
      parseInt(idZona),
      parseInt(cantidad)
    );
    return created(res, data);
  } catch (err) { next(err); }
};

const registrarPagoCtrl = async (req, res, next) => {
  try {
    const { cantidadPagada } = req.body;
    const idOrden = parseInt(req.params.idOrden);

    // Calcular el total esperado de la orden (suma de precios de boletos)
    const pool = require('../config/db');
    const [totalRows] = await pool.query(
      'SELECT SUM(ze.precio) as totalEsperado FROM boleto b JOIN zonaevento ze ON b.idZona = ze.idZona WHERE b.idOrden = ?',
      [idOrden]
    );
    const totalEsperado = totalRows[0]?.totalEsperado || 0;

    // Si el total es 0, permitir cantidadPagada = 0; de lo contrario, > 0
    if (totalEsperado <= 0) {
      if (cantidadPagada > 0) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Para boletos gratis, la cantidad pagada debe ser 0.',
        });
      }
    } else {
      if (totalEsperado > 0 && (!cantidadPagada || cantidadPagada <= 0)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La cantidad pagada es obligatoria y debe ser mayor a 0.',
        });
      }
    }

    const data = await ordenesService.registrarPago(idOrden, cantidadPagada);
    return ok(res, data);
  } catch (err) { next(err); }
};

const detallesOrdenCtrl = async (req, res, next) => {
  try {
    const data = await ordenesService.detallesOrden(
      req.user.idUsuario,
      parseInt(req.params.idOrden)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const emitirReciboCtrl = async (req, res, next) => {
  try {
    const data = await ordenesService.emitirRecibo(
      req.user.idUsuario,
      parseInt(req.params.idOrden)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const usarBoletoCtrl = async (req, res, next) => {
  try {
    const { codigoQR, idEvento } = req.body;

    if (!codigoQR || !idEvento) {
      return res.status(400).json({
        ok: false,
        mensaje: 'codigoQR e idEvento son obligatorios.',
      });
    }

    const data = await ordenesService.usarBoleto(codigoQR, parseInt(idEvento));
    return ok(res, data);
  } catch (err) { next(err); }
};

const cancelarSolicitudCtrl = async (req, res, next) => {
  try {
    const data = await ordenesService.cancelarSolicitud(
      req.user.idUsuario,
      parseInt(req.params.idSolicitud)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

module.exports = {
  crearOrdenCtrl,
  registrarPagoCtrl,
  detallesOrdenCtrl,
  emitirReciboCtrl,
  usarBoletoCtrl,
  cancelarSolicitudCtrl,
};