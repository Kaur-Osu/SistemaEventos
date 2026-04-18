const path = require('path');
const pool  = require('../config/db');
const bcrypt = require('bcryptjs');
const emailUtil = require('../utils/email');
const { AppError } = require('../utils/response');

const buildUploadUrl = (storedPath) => {
  if (!storedPath) return null;
  if (/^https?:\/\//i.test(storedPath)) return storedPath;
  const filename = path.basename(storedPath);
  const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${backendUrl}/uploads/${filename}`;
};

// ─── USUARIOS ─────────────────────────────────────────────────────────────────
const listarTodosUsuarios = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_listarTodosLosUsuarios(?)', [idAdmin]
  );
  const usuarios = rows[0].map(u => ({
    ...u,
    ine   : u.ine    ? buildUploadUrl(u.ine)    : null,
    selfie: u.selfie ? buildUploadUrl(u.selfie) : null,
  }));
  return { usuarios };
};

const usuariosPendientesVerificacion = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_usuariosPendientesVerificacion(?)', [idAdmin]
  );
  const usuarios = rows[0].map(u => ({
    ...u,
    ine   : u.ine    ? buildUploadUrl(u.ine)    : null,
    selfie: u.selfie ? buildUploadUrl(u.selfie) : null,
  }));
  return { usuarios };
};

const verDatosUsuario = async (idAdmin, idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_verDatosUsuario(?, ?)', [idUsuario, idAdmin]
  );
  const usuario = rows[0][0];
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);

  // Generar URLs locales para los documentos privados
  if (usuario.ine)    usuario.ine    = buildUploadUrl(usuario.ine);
  if (usuario.selfie) usuario.selfie = buildUploadUrl(usuario.selfie);

  return { usuario };
};

const verificarUsuario = async (idAdmin, idUsuario, aprobado, motivo = '') => {
  const [rows] = await pool.query(
    'CALL sp_Adminstrador_verificarUsuario(?, ?)',
    [idUsuario, aprobado ? 1 : 0]
  );

  const resultado = rows[0][0];
  if (resultado.mensaje !== 'OK') {
    throw new AppError('No se pudo actualizar el estado del usuario.', 400);
  }

  // Obtener datos del usuario para notificarle por correo
  const [userRows] = await pool.query(
    'SELECT nombre, correo FROM Usuario WHERE idUsuario = ?', [idUsuario]
  );

  if (userRows[0]) {
    emailUtil.enviarResultadoVerificacion(
      userRows[0].correo,
      userRows[0].nombre,
      aprobado,
      motivo
    ).catch(err => console.error('⚠️  Error enviando correo:', err.message));
  }

  return {
    mensaje: aprobado
      ? 'Usuario aprobado como organizador.'
      : 'Solicitud de usuario rechazada.',
  };
};

const desactivarUsuario = async (idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_desactivarUsuario(?)', [idUsuario]
  );
  const resultado = rows[0][0];
  if (resultado.mensaje !== 'OK_USUARIO_DESACTIVADO') {
    throw new AppError('No se pudo desactivar el usuario.', 400);
  }
  return { mensaje: 'Usuario desactivado correctamente.' };
};

// ─── EVENTOS ──────────────────────────────────────────────────────────────────

const listarEventos = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_listarEventos(?)', [idAdmin]
  );

  const eventos = rows[0];
  if (!eventos.length) return { eventos: [] };

  const ids = eventos.map(e => e.idEvento).join(',');
  const [extra] = await pool.query(
    `SELECT idEvento, rechazado, suspendido, motivoSuspension 
     FROM Evento WHERE idEvento IN (${ids})`
  );

  const extraMap = {};
  extra.forEach(r => { extraMap[r.idEvento] = r; });

  return {
    eventos: eventos.map(e => ({
      ...e,
      rechazado       : extraMap[e.idEvento]?.rechazado        ?? e.rechazado        ?? 0,
      suspendido      : extraMap[e.idEvento]?.suspendido       ?? e.suspendido       ?? 0,
      motivoSuspension: extraMap[e.idEvento]?.motivoSuspension ?? e.motivoSuspension ?? null,
    })),
  };
};

const buscarEventos = async (idAdmin, filtros) => {
  const {
    idEvento = null, titulo = null, categoria = null,
    fechaInicio = null, fechaFin = null,
    idOrganizador = null, nombreOrganizador = null,
  } = filtros;

  const [rows] = await pool.query(
    'CALL sp_Administrador_buscarEventos(?, ?, ?, ?, ?, ?, ?, ?)',
    [idAdmin, idEvento, titulo, categoria, fechaInicio, fechaFin, idOrganizador, nombreOrganizador]
  );
  return { eventos: rows[0] };
};

const eventosNoPagados = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_eventosNoPagados(?)', [idAdmin]
  );
  return { eventos: rows[0] };
};

const marcarEventoPagado = async (idAdmin, idEvento, cantidadDepositada) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_marcaEventoPagado(?, ?, ?)',
    [idEvento, idAdmin, cantidadDepositada]
  );
  const resultado = rows[0][0];
  if (resultado?.mensaje?.includes('no')) {
    throw new AppError(resultado.mensaje, 400);
  }
  return { mensaje: 'Evento marcado como pagado correctamente.' };
};

const modificarEventoListado = async (idAdmin, idEvento, datos) => {
  const {
    titulo, descripcion, categoria, fecha,
    ubicacion, listado, cancelado, motivos,
  } = datos;

  const [rows] = await pool.query(
    'CALL sp_Administrador_modificarEventoListado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [idAdmin, idEvento, titulo, descripcion, categoria, fecha, ubicacion, listado, cancelado, motivos]
  );

  const resultado = rows[0][0];
  if (resultado.mensaje !== 'OK_EVENTO_MODIFICADO') {
    throw new AppError(resultado.mensaje, 400);
  }
  return { mensaje: 'Evento modificado correctamente.' };
};

// ─── SOLICITUDES ──────────────────────────────────────────────────────────────

const listarSolicitudes = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_listarSolicitudes(?)', [idAdmin]
  );
  return { solicitudes: rows[0] };
};

const listarSolicitudesPendientes = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_listarSolicitudesPendientes(?)', [idAdmin]
  );
  return { solicitudes: rows[0] };
};

const resolverSolicitud = async (idAdmin, idSolicitud, aprobado) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_resolverSolicitudEvento(?, ?, ?)',
    [idAdmin, idSolicitud, aprobado]
  );
  const resultado = rows[0][0];
  if (!resultado.mensaje.startsWith('OK')) {
    throw new AppError(resultado.mensaje, 400);
  }
  return { mensaje: aprobado ? 'Solicitud aprobada.' : 'Solicitud rechazada.' };
};

// ─── IMÁGENES ─────────────────────────────────────────────────────────────────

const listarImagenesPendientes = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_listarImagenePendientesAprobacion(?)', [idAdmin]
  );
  return { imagenes: rows[0] };
};

const aprobarRechazarImagen = async (idImagen, accion, motivo = null) => {
  if (!['Aprobada', 'Rechazada'].includes(accion)) {
    throw new AppError('Acción inválida. Usa Aprobada o Rechazada.', 400);
  }
  const [rows] = await pool.query(
    'CALL sp_Administrador_aprobarRechazarImagenEvento(?, ?, ?)',
    [idImagen, accion, motivo]
  );
  const resultado = rows[0][0];
  if (!resultado.mensaje.startsWith('OK')) {
    throw new AppError(resultado.mensaje, 400);
  }
  return { mensaje: `Imagen ${accion.toLowerCase()} correctamente.` };
};

// ─── ÓRDENES ──────────────────────────────────────────────────────────────────

const buscarOrden = async (filtros) => {
  const {
    idOrden = null, idUsuario = null, idEvento = null,
    nombreUsuario = null, fechaInicio = null,
    fechaFin = null, nombreEvento = null,
  } = filtros;

  const [rows] = await pool.query(
    'CALL sp_Administrador_buscarOrden(?, ?, ?, ?, ?, ?, ?)',
    [idOrden, idUsuario, idEvento, nombreUsuario, fechaInicio, fechaFin, nombreEvento]
  );
  return { ordenes: rows[0] };
};

// ─── ADMINS ───────────────────────────────────────────────────────────────────

const listarAdmins = async (idAdmin) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_listarAdmins(?)', [idAdmin]
  );
  if (rows[0][0]?.mensaje === 'ERROR_NO_AUTORIZADO') {
    throw new AppError('Solo el dueño puede gestionar administradores.', 403);
  }
  return { admins: rows[0] };
};

const registrarAdmin = async (nombre, correo, contrasena) => {
  const hash = await require('bcryptjs').hash(contrasena, 10);
  const [rows] = await pool.query(
    'CALL sp_Administrador_registrarNuevoAdmin(?, ?, ?)',
    [nombre, correo, hash]
  );
  const resultado = rows[0][0];
  if (resultado.mensaje === 'ERROR_CORREO_EXISTENTE') {
    throw new AppError('Este correo ya está registrado como administrador.', 409);
  }
  return { mensaje: 'Administrador registrado correctamente.' };
};

const desactivarAdmin = async (idAdminDueno, idAdminDesactivar, motivo) => {
  const [rows] = await pool.query(
    'CALL sp_Administrador_desactivarAdmin(?, ?)',
    [idAdminDueno, idAdminDesactivar]
  );
  const resultado = rows[0][0];
  const errores = {
    ERROR_ADMIN_NO_EXISTE_O_NO_ACTIVO     : ['El administrador no existe o ya está inactivo.', 404],
    ERROR_NO_SE_PUEDE_DESACTIVAR_A_SI_MISMO: ['No puedes desactivarte a ti mismo.', 400],
    ERROR_NO_SE_PUEDE_DESACTIVAR_AL_DUENO : ['No se puede desactivar al dueño.', 400],
  };
  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  // Notificar al admin desactivado
  const [adminRows] = await pool.query(
    'SELECT nombre, correo FROM Administrador WHERE idAdministrador = ?',
    [idAdminDesactivar]
  );
  if (adminRows[0]) {
    require('../utils/email').enviarCorreo({
      para  : adminRows[0].correo,
      asunto: 'Tu acceso de administrador fue desactivado — Eventos App',
      html  : `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#0F172A;">Acceso desactivado</h2>
          <p>Hola <strong>${adminRows[0].nombre}</strong>, tu acceso al panel de administración ha sido desactivado.</p>
          <div style="background:#FEF2F2;border-left:4px solid #EF4444;padding:12px 16px;margin:16px 0;border-radius:4px;">
            <p style="color:#991B1B;font-weight:600;margin:0 0 4px;">Motivo:</p>
            <p style="color:#7F1D1D;margin:0;">${motivo ?? 'Sin motivo especificado'}</p>
          </div>
          <p style="color:#64748B;">Contacta al administrador principal si crees que esto es un error.</p>
        </div>
      `,
    }).catch(() => null);
  }

  return { mensaje: 'Administrador desactivado correctamente.' };
};

// Buscar usuario verificado por correo para promoverlo a admin
const buscarUsuarioParaAdmin = async (correo) => {
  const [rows] = await pool.query(
    `SELECT idUsuario, nombre, correo, correoVerificado
     FROM Usuario
     WHERE correo = ? AND activo = TRUE AND correoVerificado = TRUE
     LIMIT 1`,
    [correo]
  );
  if (!rows[0]) throw new AppError('Usuario no encontrado o correo no verificado.', 404);
  return { usuario: rows[0] };
};

// Promover usuario a administrador
const promoverUsuarioAAdmin = async (idAdminDueno, idUsuario, contrasena) => {
  // Verificar que quien promueve es el dueño
  const [check] = await pool.query(
    'SELECT dueno FROM Administrador WHERE idAdministrador = ? AND activo = TRUE',
    [idAdminDueno]
  );
  if (!check[0]?.dueno) throw new AppError('Solo el dueño puede promover usuarios.', 403);

  const [userRows] = await pool.query(
    'SELECT nombre, correo, correoVerificado FROM Usuario WHERE idUsuario = ? AND activo = TRUE',
    [idUsuario]
  );
  const usuario = userRows[0];
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);
  if (!usuario.correoVerificado) throw new AppError('El usuario debe tener el correo verificado.', 400);

  // Verificar que no sea ya admin
  const [adminCheck] = await pool.query(
    'SELECT idAdministrador FROM Administrador WHERE correo = ?',
    [usuario.correo]
  );
  if (adminCheck[0]) throw new AppError('Este usuario ya es administrador.', 409);

  const hash = await require('bcryptjs').hash(contrasena, 10);
  await pool.query(
    'INSERT INTO Administrador (nombre, correo, contrasena, dueno, activo) VALUES (?, ?, ?, FALSE, TRUE)',
    [usuario.nombre, usuario.correo, hash]
  );

  // Notificar al usuario promovido
  require('../utils/email').enviarCorreo({
    para  : usuario.correo,
    asunto: '¡Fuiste promovido a administrador! — Eventos App',
    html  : `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
        <h2 style="color:#0F172A;">¡Bienvenido al equipo!</h2>
        <p>Hola <strong>${usuario.nombre}</strong>, has sido promovido a administrador de Eventos App.</p>
        <p style="color:#64748B;">Tu contraseña temporal ha sido configurada. Te recomendamos cambiarla desde el panel.</p>
      </div>
    `,
  }).catch(() => null);

  return { mensaje: 'Usuario promovido a administrador correctamente.' };
};

module.exports = {
  listarTodosUsuarios,
  usuariosPendientesVerificacion,
  verDatosUsuario,
  verificarUsuario,
  desactivarUsuario,
  listarEventos,
  buscarEventos,
  eventosNoPagados,
  marcarEventoPagado,
  modificarEventoListado,
  listarSolicitudes,
  listarSolicitudesPendientes,
  resolverSolicitud,
  listarImagenesPendientes,
  aprobarRechazarImagen,
  buscarOrden,
  listarAdmins,
  registrarAdmin,
  desactivarAdmin,
  buscarUsuarioParaAdmin,
  promoverUsuarioAAdmin,
};