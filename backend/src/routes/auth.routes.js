const router  = require('express').Router();
const ctrl    = require('../controllers/auth.controller');
const { verifyToken, requireCorreoVerificado } = require('../middlewares/auth');
const { uploadDocumentosVerificacion }         = require('../middlewares/upload');

// ─── Rutas públicas ───────────────────────────────────────────────────────────
router.post('/registro',                          ctrl.registroCtrl);
router.post('/login',                             ctrl.loginCtrl);
router.post('/admin/login',                       ctrl.loginAdminCtrl);
router.get ('/verificar-correo/:idUsuario/:token',ctrl.verificarCorreoCtrl);
router.post('/recuperar-contrasena',              ctrl.recuperarContrasenaCtrl);
router.post('/restablecer-contrasena/:token',     ctrl.restablecerContrasenaCtrl);

// ─── Rutas protegidas ─────────────────────────────────────────────────────────
router.post('/reenviar-verificacion', verifyToken, ctrl.reenviarVerificacionCtrl);
router.put ('/cambiar-contrasena',    verifyToken, ctrl.cambiarContrasenaCtrl);
router.get ('/me',                    verifyToken, ctrl.meCtrl);

// Spread del array de middlewares de upload
router.post(
  '/verificarse',
  verifyToken,
  requireCorreoVerificado,
  ...uploadDocumentosVerificacion,
  ctrl.verificarseCtrl
);

module.exports = router;