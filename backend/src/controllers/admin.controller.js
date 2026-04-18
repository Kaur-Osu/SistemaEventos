const adminService = require('../services/admin.service');
const { ok, created } = require('../utils/response');

// ─── USUARIOS ─────────────────────────────────────────────────────────────────
const listarUsuariosCtrl = async (req, res, next) => {
  try {
    const data = await adminService.listarTodosUsuarios(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const usuariosPendientesCtrl = async (req, res, next) => {
  try {
    const data = await adminService.usuariosPendientesVerificacion(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const verUsuarioCtrl = async (req, res, next) => {
  try {
    const data = await adminService.verDatosUsuario(
      req.user.idAdministrador,
      parseInt(req.params.idUsuario)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const verificarUsuarioCtrl = async (req, res, next) => {
  try {
    const { aprobado, motivo } = req.body;
    if (typeof aprobado !== 'boolean') {
      return res.status(400).json({ ok: false, mensaje: 'El campo aprobado debe ser true o false.' });
    }
    const data = await adminService.verificarUsuario(
      req.user.idAdministrador,
      parseInt(req.params.idUsuario),
      aprobado,
      motivo
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const desactivarUsuarioCtrl = async (req, res, next) => {
  try {
    const data = await adminService.desactivarUsuario(parseInt(req.params.idUsuario));
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── EVENTOS ──────────────────────────────────────────────────────────────────
const listarEventosCtrl = async (req, res, next) => {
  try {
    const data = await adminService.listarEventos(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const buscarEventosCtrl = async (req, res, next) => {
  try {
    const data = await adminService.buscarEventos(req.user.idAdministrador, req.query);
    return ok(res, data);
  } catch (err) { next(err); }
};

const eventosNoPagadosCtrl = async (req, res, next) => {
  try {
    const data = await adminService.eventosNoPagados(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const marcarPagadoCtrl = async (req, res, next) => {
  try {
    const { cantidadDepositada } = req.body;
    if (!cantidadDepositada) {
      return res.status(400).json({ ok: false, mensaje: 'La cantidad depositada es obligatoria.' });
    }
    const data = await adminService.marcarEventoPagado(
      req.user.idAdministrador,
      parseInt(req.params.idEvento),
      cantidadDepositada
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const modificarEventoCtrl = async (req, res, next) => {
  try {
    const data = await adminService.modificarEventoListado(
      req.user.idAdministrador,
      parseInt(req.params.idEvento),
      req.body
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── SOLICITUDES ──────────────────────────────────────────────────────────────
const listarSolicitudesCtrl = async (req, res, next) => {
  try {
    const data = await adminService.listarSolicitudes(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const listarSolicitudesPendientesCtrl = async (req, res, next) => {
  try {
    const data = await adminService.listarSolicitudesPendientes(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const resolverSolicitudCtrl = async (req, res, next) => {
  try {
    const { aprobado } = req.body;
    if (typeof aprobado !== 'boolean') {
      return res.status(400).json({ ok: false, mensaje: 'El campo aprobado debe ser true o false.' });
    }
    const data = await adminService.resolverSolicitud(
      req.user.idAdministrador,
      parseInt(req.params.idSolicitud),
      aprobado
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── IMÁGENES ─────────────────────────────────────────────────────────────────
const imagenesPendientesCtrl = async (req, res, next) => {
  try {
    const data = await adminService.listarImagenesPendientes(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const aprobarImagenCtrl = async (req, res, next) => {
  try {
    const { accion, motivo } = req.body;
    const data = await adminService.aprobarRechazarImagen(
      parseInt(req.params.idImagen),
      accion,
      motivo
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── ÓRDENES ──────────────────────────────────────────────────────────────────
const buscarOrdenCtrl = async (req, res, next) => {
  try {
    const data = await adminService.buscarOrden(req.query);
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── ADMINS ───────────────────────────────────────────────────────────────────
const listarAdminsCtrl = async (req, res, next) => {
  try {
    const data = await adminService.listarAdmins(req.user.idAdministrador);
    return ok(res, data);
  } catch (err) { next(err); }
};

const registrarAdminCtrl = async (req, res, next) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Nombre, correo y contraseña son obligatorios.' });
    }
    const data = await adminService.registrarAdmin(nombre, correo, contrasena);
    return created(res, data);
  } catch (err) { next(err); }
};

const desactivarAdminCtrl = async (req, res, next) => {
  try {
    const data = await adminService.desactivarAdmin(
      req.user.idAdministrador,
      parseInt(req.params.idAdmin)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

module.exports = {
  listarUsuariosCtrl,
  usuariosPendientesCtrl,
  verUsuarioCtrl,
  verificarUsuarioCtrl,
  desactivarUsuarioCtrl,
  listarEventosCtrl,
  buscarEventosCtrl,
  eventosNoPagadosCtrl,
  marcarPagadoCtrl,
  modificarEventoCtrl,
  listarSolicitudesCtrl,
  listarSolicitudesPendientesCtrl,
  resolverSolicitudCtrl,
  imagenesPendientesCtrl,
  aprobarImagenCtrl,
  buscarOrdenCtrl,
  listarAdminsCtrl,
  registrarAdminCtrl,
  desactivarAdminCtrl,
};