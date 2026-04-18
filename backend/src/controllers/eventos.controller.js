const eventosService = require('../services/eventos.service');
const { ok, created } = require('../utils/response');

// ─── PÚBLICO ──────────────────────────────────────────────────────────────────
const listarPublicosCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.listarEventosPublicos();
    return ok(res, data);
  } catch (err) { next(err); }
};

const detalleEventoCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.obtenerDetalleEvento(parseInt(req.params.idEvento));
    return ok(res, data);
  } catch (err) { next(err); }
};

const zonasEventoCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.obtenerZonasEvento(parseInt(req.params.idEvento));
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── ORGANIZADOR ──────────────────────────────────────────────────────────────
const misEventosCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.misEventos(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};

const eventosHoyCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.eventosHoy(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};

const crearEventoCtrl = async (req, res, next) => {
  try {
    const { titulo, descripcion, categoria, fecha, ubicacion, zonas } = req.body;

    if (!titulo || !categoria || !fecha || !ubicacion) {
      return res.status(400).json({ ok: false, mensaje: 'Título, categoría, fecha y ubicación son obligatorios.' });
    }

    const data = await eventosService.crearEvento(req.user.idUsuario, {
      titulo, descripcion, categoria, fecha, ubicacion,
      zonas: typeof zonas === 'string' ? JSON.parse(zonas) : zonas,
    });
    return created(res, data);
  } catch (err) { next(err); }
};

const editarEventoCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.editarEvento(
      req.user.idUsuario,
      parseInt(req.params.idEvento),
      req.body
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const publicarEventoCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.publicarEvento(
      req.user.idUsuario,
      parseInt(req.params.idEvento)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const cancelarEventoCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.cancelarEvento(
      req.user.idUsuario,
      parseInt(req.params.idEvento)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── ZONAS ────────────────────────────────────────────────────────────────────
const agregarZonaCtrl = async (req, res, next) => {
  try {
    const { nombre, precio, capacidad } = req.body;
    if (!nombre || !precio || !capacidad) {
      return res.status(400).json({ ok: false, mensaje: 'Nombre, precio y capacidad son obligatorios.' });
    }
    const data = await eventosService.agregarZona(
      req.user.idUsuario,
      parseInt(req.params.idEvento),
      { nombre, precio, capacidad }
    );
    return created(res, data);
  } catch (err) { next(err); }
};

const editarZonaCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.editarZona(
      req.user.idUsuario,
      parseInt(req.params.idZona),
      req.body
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const eliminarZonaCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.eliminarZona(
      req.user.idUsuario,
      parseInt(req.params.idZona)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── IMÁGENES ─────────────────────────────────────────────────────────────────
// ─── IMÁGENES ─────────────────────────────────────────────────────────────────
const subirImagenCtrl = async (req, res, next) => {
  try {
    // Validar que multer haya procesado un archivo
    if (!req.file) {
      return res.status(400).json({ ok: false, mensaje: 'No se recibió ninguna imagen.' });
    }

    // Saber si es portada (bandera enviada desde el frontend)
    const esPortada = req.body.portada === 'true';

    // Registrar en BD usando tu servicio
    const data = await eventosService.subirImagen(
      req.user.idUsuario,              // usuario autenticado
      parseInt(req.params.idEvento),   // idEvento desde la URL
      req.file.filename,               // nombre final del archivo (ya renombrado por multer)
      esPortada
    );

    // Responder al cliente con datos de BD y nombre físico del archivo
    return created(res, {
      ...data,
      archivo: req.file.filename,      // ej. "11-44-imagen.png"
      ruta: `/uploads/${req.file.filename}` // opcional: ruta relativa si quieres mostrarla
    });
  } catch (err) {
    next(err);
  }
};

const quitarImagenCtrl = async (req, res, next) => {
  try {
    const data = await eventosService.quitarImagen(
      req.user.idUsuario,
      parseInt(req.params.idImagen)
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

// ─── SOLICITUDES ──────────────────────────────────────────────────────────────
const solicitarModificacionCtrl = async (req, res, next) => {
  try {
    const { causa } = req.body;
    if (!causa) return res.status(400).json({ ok: false, mensaje: 'La causa es obligatoria.' });
    const data = await eventosService.solicitarModificacion(
      req.user.idUsuario,
      parseInt(req.params.idEvento),
      causa
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

const solicitarCancelacionCtrl = async (req, res, next) => {
  try {
    const { causa } = req.body;
    if (!causa) return res.status(400).json({ ok: false, mensaje: 'La causa es obligatoria.' });
    const data = await eventosService.solicitarCancelacion(
      req.user.idUsuario,
      parseInt(req.params.idEvento),
      causa
    );
    return ok(res, data);
  } catch (err) { next(err); }
};

module.exports = {
  listarPublicosCtrl,
  detalleEventoCtrl,
  zonasEventoCtrl,
  misEventosCtrl,
  eventosHoyCtrl,
  crearEventoCtrl,
  editarEventoCtrl,
  publicarEventoCtrl,
  cancelarEventoCtrl,
  agregarZonaCtrl,
  editarZonaCtrl,
  eliminarZonaCtrl,
  subirImagenCtrl,
  quitarImagenCtrl,
  solicitarModificacionCtrl,
  solicitarCancelacionCtrl,
};