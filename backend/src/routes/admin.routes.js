const router = require('express').Router();
const ctrl   = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth');

// Todas las rutas requieren JWT y rol admin
router.use(verifyToken, checkRole('admin'));

// ─── Usuarios ─────────────────────────────────────────────────────────────────
router.get ('/usuarios',                        ctrl.listarUsuariosCtrl);
router.get ('/usuarios/pendientes',             ctrl.usuariosPendientesCtrl);
router.get('/usuarios/buscar-para-admin', async (req, res, next) => {
  try {
    const data = await require('../services/admin.service').buscarUsuarioParaAdmin(req.query.correo);
    res.json({ ok: true, ...data });
  } catch (err) { next(err); }
});

router.get ('/usuarios/:idUsuario',             ctrl.verUsuarioCtrl);
router.put ('/usuarios/:idUsuario/verificar',   ctrl.verificarUsuarioCtrl);
router.put ('/usuarios/:idUsuario/desactivar',  ctrl.desactivarUsuarioCtrl);

// ─── Eventos ──────────────────────────────────────────────────────────────────
router.get ('/eventos',                         ctrl.listarEventosCtrl);
router.get ('/eventos/buscar',                  ctrl.buscarEventosCtrl);
router.get ('/eventos/no-pagados',              ctrl.eventosNoPagadosCtrl);
router.put ('/eventos/:idEvento',               ctrl.modificarEventoCtrl);
router.put ('/eventos/:idEvento/marcar-pagado', ctrl.marcarPagadoCtrl);

// ─── Solicitudes ──────────────────────────────────────────────────────────────
router.get ('/solicitudes',                           ctrl.listarSolicitudesCtrl);
router.get ('/solicitudes/pendientes',                ctrl.listarSolicitudesPendientesCtrl);
router.put ('/solicitudes/:idSolicitud/resolver',     ctrl.resolverSolicitudCtrl);

// ─── Imágenes ─────────────────────────────────────────────────────────────────
router.get ('/imagenes/pendientes',             ctrl.imagenesPendientesCtrl);
router.put ('/imagenes/:idImagen/revisar',      ctrl.aprobarImagenCtrl);

// ─── Órdenes ──────────────────────────────────────────────────────────────────
router.get ('/ordenes/buscar',                  ctrl.buscarOrdenCtrl);

// ─── Admins ───────────────────────────────────────────────────────────────────
router.get ('/admins',                          ctrl.listarAdminsCtrl);
router.post('/admins',                          ctrl.registrarAdminCtrl);

router.put('/admins/:idAdmin/desactivar', async (req, res, next) => {
  try {
    const { motivo } = req.body;
    const data = await require('../services/admin.service')
      .desactivarAdmin(req.user.idAdministrador, parseInt(req.params.idAdmin), motivo);
    res.json({ ok: true, ...data });
  } catch (err) { next(err); }
});

router.put('/admins/:idAdmin/reactivar', async (req, res, next) => {
  try {
    const db = require('../config/db');
    const idAdmin = parseInt(req.params.idAdmin);

    // Solo el dueño puede reactivar
    const [check] = await db.query(
      'SELECT dueno FROM Administrador WHERE idAdministrador = ? AND activo = TRUE',
      [req.user.idAdministrador]
    );
    if (!check[0]?.dueno) {
      return res.status(403).json({ ok: false, mensaje: 'Solo el dueño puede reactivar administradores.' });
    }

    await db.query(
      'UPDATE Administrador SET activo = TRUE WHERE idAdministrador = ?',
      [idAdmin]
    );

    res.json({ ok: true, mensaje: 'Administrador reactivado correctamente.' });
  } catch (err) { next(err); }
});

// Promover usuario a admin
router.post('/admins/promover', async (req, res, next) => {
  try {
    const { idUsuario, contrasena } = req.body;
    const data = await require('../services/admin.service')
      .promoverUsuarioAAdmin(req.user.idAdministrador, idUsuario, contrasena);
    res.json({ ok: true, ...data });
  } catch (err) { next(err); }
});

// Aprobar evento directamente (pone listado=true)
router.put('/eventos/:idEvento/aprobar', async (req, res, next) => {
  try {
    const db = require('../config/db');
    const idEvento = req.params.idEvento;

    // 1. Publicar el evento
    await db.query(
      'UPDATE Evento SET listado = TRUE WHERE idEvento = ?',
      [idEvento]
    );

    // 2. Aprobar todas las imágenes pendientes del evento
    await db.query(
      `UPDATE ImagenEvento 
       SET estado = 'Aprobada', fechaAprobacion = NOW()
       WHERE idEvento = ? AND estado = 'Pendiente'`,
      [idEvento]
    );

    res.json({ ok: true, mensaje: 'Evento e imágenes aprobados correctamente.' });
  } catch (err) { next(err); }
});

// Rechazar evento (pone listado=false, guarda motivo)
router.put('/eventos/:idEvento/rechazar', async (req, res, next) => {
  try {
    const db = require('../config/db');
    const { motivo } = req.body;
    const idEvento = req.params.idEvento;

    // Guardar motivo + marcar como rechazado
    await db.query(
      'UPDATE Evento SET rechazado = TRUE, listado = FALSE, motivoRechazo = ? WHERE idEvento = ?',
      [motivo ?? null, idEvento]
    );

    // Rechazar imágenes pendientes
    await db.query(
      `UPDATE ImagenEvento SET estado = 'Rechazada', motivo = ?
       WHERE idEvento = ? AND estado = 'Pendiente'`,
      [motivo ?? 'Evento rechazado', idEvento]
    );

    // Notificar al organizador
    const [eventoRows] = await db.query(
      `SELECT e.titulo, u.nombre, u.correo
       FROM Evento e
       INNER JOIN Usuario u ON e.idUsuario = u.idUsuario
       WHERE e.idEvento = ?`,
      [idEvento]
    );

    if (eventoRows[0]) {
      const emailUtil = require('../utils/email');
      emailUtil.enviarCorreo({
        para  : eventoRows[0].correo,
        asunto: `Tu evento fue rechazado — ${eventoRows[0].titulo}`,
        html  : `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <h2 style="color:#0F172A;">Evento rechazado</h2>
            <p>Hola <strong>${eventoRows[0].nombre}</strong>, tu evento <strong>${eventoRows[0].titulo}</strong> fue rechazado.</p>
            <div style="background:#FEF2F2;border-left:4px solid #EF4444;padding:12px 16px;margin:16px 0;border-radius:4px;">
              <p style="color:#991B1B;font-weight:600;margin:0 0 4px;">Motivo:</p>
              <p style="color:#7F1D1D;margin:0;">${motivo ?? 'Sin motivo especificado'}</p>
            </div>
            <p style="color:#64748B;">Puedes editar tu evento y reenviarlo para revisión desde tu panel de organizador.</p>
          </div>
        `,
      }).catch(() => null);
    }

    res.json({ ok: true, mensaje: 'Evento rechazado. Se notificó al organizador.' });
  } catch (err) { next(err); }
});

router.get('/eventos/:idEvento/detalle', async (req, res, next) => {
  try {
    const data = await require('../services/eventos.service')
      .obtenerDetalleEvento(parseInt(req.params.idEvento), true); // incluirPendientes=true
    res.json({ ok: true, ...data });
  } catch (err) { next(err); }
});

// Suspender evento publicado
router.put('/eventos/:idEvento/suspender', async (req, res, next) => {
  try {
    const db = require('../config/db');
    const { motivo } = req.body;
    const idEvento = req.params.idEvento;

    await db.query(
      `UPDATE Evento 
       SET suspendido = TRUE, listado = FALSE, motivoSuspension = ?
       WHERE idEvento = ? AND listado = TRUE`,
      [motivo ?? null, idEvento]
    );

    // Notificar al organizador
    const [eventoRows] = await db.query(
      `SELECT e.titulo, u.nombre, u.correo
       FROM Evento e
       INNER JOIN Usuario u ON e.idUsuario = u.idUsuario
       WHERE e.idEvento = ?`,
      [idEvento]
    );

    if (eventoRows[0]) {
      require('../utils/email').enviarCorreo({
        para  : eventoRows[0].correo,
        asunto: `Tu evento fue suspendido — ${eventoRows[0].titulo}`,
        html  : `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <h2 style="color:#0F172A;">Evento suspendido temporalmente</h2>
            <p>Hola <strong>${eventoRows[0].nombre}</strong>, tu evento <strong>${eventoRows[0].titulo}</strong> ha sido suspendido por el siguiente motivo:</p>
            <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 16px;margin:16px 0;border-radius:4px;">
              <p style="color:#92400E;margin:0;">${motivo ?? 'Infracción de las políticas de la plataforma'}</p>
            </div>
            <p style="color:#64748B;">Contacta a soporte si crees que esto es un error.</p>
          </div>
        `,
      }).catch(() => null);
    }

    res.json({ ok: true, mensaje: 'Evento suspendido correctamente.' });
  } catch (err) { next(err); }
});

// Reactivar evento suspendido
router.put('/eventos/:idEvento/reactivar', async (req, res, next) => {
  try {
    await require('../config/db').query(
      `UPDATE Evento 
       SET suspendido = FALSE, listado = TRUE, motivoSuspension = NULL
       WHERE idEvento = ?`,
      [req.params.idEvento]
    );
    res.json({ ok: true, mensaje: 'Evento reactivado y publicado nuevamente.' });
  } catch (err) { next(err); }
});

module.exports = router;