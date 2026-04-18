const router = require('express').Router();
const ctrl   = require('../controllers/usuarios.controller');
const { verifyToken } = require('../middlewares/auth');

// Todas las rutas de usuarios requieren estar logueado
router.use(verifyToken);

// ─── Perfil propio ────────────────────────────────────────────────────────────
router.get('/perfil', ctrl.obtenerPerfilCtrl);

// ─── Mis eventos y boletos ────────────────────────────────────────────────────
router.get('/mis-eventos',          ctrl.obtenerEventosCompradosCtrl);
router.get('/mis-eventos/proximos', ctrl.obtenerEventosProximosCtrl);
router.get('/mis-boletos/:idOrden', ctrl.obtenerBoletosPorOrdenCtrl);
router.get('/boleto/:idBoleto',     ctrl.descargarBoletoCtrl);
router.get('/mis-ordenes',          ctrl.misOrdenesCtrl);

// ─── Perfil público de otro usuario (no requiere login) ──────────────────────
router.get('/publico/:idUsuario', ctrl.obtenerPerfilPublicoCtrl);

module.exports = router;