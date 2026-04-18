const router = require('express').Router();
const ctrl   = require('../controllers/eventos.controller');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { uploadImagenEvento }     = require('../middlewares/upload');

// ─── Rutas públicas ───────────────────────────────────────────────────────────
router.get('/', ctrl.listarPublicosCtrl);

// ─── Rutas de organizador (ANTES de /:idEvento) ───────────────────────────────
router.get(
  '/organizador/mis-eventos',
  verifyToken, checkRole('organizador'),
  ctrl.misEventosCtrl
);

router.get(
  '/organizador/eventos-hoy',
  verifyToken, checkRole('organizador'),
  ctrl.eventosHoyCtrl
);

router.get(
  '/organizador/:idEvento',
  verifyToken, checkRole('organizador'),
  async (req, res, next) => {
    try {
      const data = await require('../services/eventos.service')
        .obtenerDetalleEventoOrganizador(
          parseInt(req.params.idEvento),
          req.user.idUsuario
        );
      res.json({ ok: true, ...data });
    } catch (err) { next(err); }
  }
);

router.put(
  '/zonas/:idZona',
  verifyToken, checkRole('organizador'),
  ctrl.editarZonaCtrl
);

router.delete(
  '/zonas/:idZona',
  verifyToken, checkRole('organizador'),
  ctrl.eliminarZonaCtrl
);

router.delete(
  '/imagenes/:idImagen',
  verifyToken, checkRole('organizador'),
  ctrl.quitarImagenCtrl
);

// ─── Rutas genéricas con /:idEvento (DESPUÉS de las específicas) ──────────────
router.get('/:idEvento',       ctrl.detalleEventoCtrl);
router.get('/:idEvento/zonas', ctrl.zonasEventoCtrl);

router.post(
  '/',
  verifyToken, checkRole('organizador'),
  ctrl.crearEventoCtrl
);

router.put(
  '/:idEvento',
  verifyToken, checkRole('organizador'),
  async (req, res, next) => {
    try {
      const eventosService = require('../services/eventos.service');
      const pool = require('../config/db');
      const idEvento = parseInt(req.params.idEvento);
      const idUsuario = req.user.idUsuario;

      // Guardar los cambios del evento
      await eventosService.editarEvento(idUsuario, idEvento, req.body);

      // Si el evento estaba rechazado, limpiarlo para que vuelva a revisión
      await pool.query(
        `UPDATE Evento 
         SET rechazado = FALSE, motivoRechazo = NULL 
         WHERE idEvento = ? AND idUsuario = ? AND rechazado = TRUE`,
        [idEvento, idUsuario]
      );

      res.json({ ok: true, mensaje: 'Cambios guardados. El evento fue enviado a revisión nuevamente.' });
    } catch (err) { next(err); }
  }
);

router.put(
  '/:idEvento/publicar',
  verifyToken, checkRole('organizador'),
  ctrl.publicarEventoCtrl
);

router.put(
  '/:idEvento/cancelar',
  verifyToken, checkRole('organizador'),
  ctrl.cancelarEventoCtrl
);

router.put(
  '/:idEvento/reenviar',
  verifyToken, checkRole('organizador'),
  async (req, res, next) => {
    try {
      const pool = require('../config/db');
      const [result] = await pool.query(
        'UPDATE Evento SET rechazado = FALSE, motivoRechazo = NULL WHERE idEvento = ? AND idUsuario = ? AND rechazado = TRUE',
        [req.params.idEvento, req.user.idUsuario]
      );
      if (result.affectedRows === 0) {
        return res.status(400).json({ ok: false, mensaje: 'Evento no encontrado o no fue rechazado.' });
      }
      res.json({ ok: true, mensaje: 'Evento reenviado para revisión.' });
    } catch (err) { next(err); }
  }
);

router.post(
  '/:idEvento/zonas',
  verifyToken, checkRole('organizador'),
  ctrl.agregarZonaCtrl
);

router.post(
  '/:idEvento/imagenes',
  verifyToken, checkRole('organizador'),
  ...uploadImagenEvento,
  ctrl.subirImagenCtrl
);

router.post(
  '/:idEvento/solicitar-modificacion',
  verifyToken, checkRole('organizador'),
  ctrl.solicitarModificacionCtrl
);

router.post(
  '/:idEvento/solicitar-cancelacion',
  verifyToken, checkRole('organizador'),
  ctrl.solicitarCancelacionCtrl
);

module.exports = router;