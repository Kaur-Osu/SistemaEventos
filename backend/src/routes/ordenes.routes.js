const router = require('express').Router();
const ctrl   = require('../controllers/ordenes.controller');
const { verifyToken } = require('../middlewares/auth');

// Todas las rutas requieren estar logueado
router.use(verifyToken);

// ─── Compra ───────────────────────────────────────────────────────────────────
router.post('/',                          ctrl.crearOrdenCtrl);
router.post('/:idOrden/pagar',            ctrl.registrarPagoCtrl);

// ─── Consultas ────────────────────────────────────────────────────────────────
router.get ('/:idOrden',                  ctrl.detallesOrdenCtrl);
router.get ('/:idOrden/recibo',           ctrl.emitirReciboCtrl);

// ─── Escaneo de boleto en puerta ──────────────────────────────────────────────
router.post('/boletos/usar',              ctrl.usarBoletoCtrl);

// ─── Cancelar solicitud ───────────────────────────────────────────────────────
router.delete('/solicitudes/:idSolicitud', ctrl.cancelarSolicitudCtrl);

// Ruta para usar/validar un boleto en puerta
router.post(
  '/usar-boleto',
  verifyToken,
  async (req, res, next) => {
    try {
      const { codigoQR, idEvento } = req.body;
      if (!codigoQR) {
        return res.status(400).json({ ok: false, mensaje: 'El código QR es obligatorio.' });
      }
      if (!idEvento) {
        return res.status(400).json({ ok: false, mensaje: 'El ID del evento es obligatorio.' });
      }

      const data = await require('../services/ordenes.service')
        .usarBoleto(codigoQR, idEvento);

      res.json({ ok: true, ...data });
    } catch (err) { next(err); }
  }
);

module.exports = router;