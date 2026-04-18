const pool     = require('../config/db');
const bcrypt   = require('bcryptjs');
const { AppError } = require('../utils/response');

// ─── Obtener perfil propio ────────────────────────────────────────────────────
const obtenerPerfil = async (idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_obtenerPerfilUsuario(?)',
    [idUsuario]
  );

  const usuario = rows[0][0];
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);

  // No devolvemos datos sensibles
  delete usuario.contrasena;
  delete usuario.tokenVerificacionCorreo;
  delete usuario.tokenCambiarContrasena;
  delete usuario.fechaExpiracionTokenVerificacionCorreo;
  delete usuario.fechaExpiracionTokenCambiarContrasena;

  return { usuario };
};

// ─── Obtener perfil público de otro usuario ───────────────────────────────────
const obtenerPerfilPublico = async (idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_perfilOtroUsuario(?)',
    [idUsuario]
  );

  const usuario = rows[0][0];
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);

  return { usuario };
};

// ─── Eventos comprados por el usuario ────────────────────────────────────────
const obtenerEventosComprados = async (idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_eventosCompradosUsuario(?)',
    [idUsuario]
  );

  return { eventos: rows[0] };
};

// ─── Eventos próximos del usuario ────────────────────────────────────────────
const obtenerEventosProximos = async (idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_eventosProximosUsuario(?)',
    [idUsuario]
  );

  return { eventos: rows[0] };
};

// ─── Boletos por orden ────────────────────────────────────────────────────────
const obtenerBoletosPorOrden = async (idUsuario, idOrden) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_boletosPorOrden(?)',
    [idOrden]
  );
  return { boletos: rows[0] };
};

// ─── Descargar boleto ─────────────────────────────────────────────────────────
const descargarBoleto = async (idUsuario, idBoleto) => {
  const [rows] = await pool.query(
    'CALL sp_descargarBoleto(?, ?)',
    [idUsuario, idBoleto]
  );

  const resultado = rows[0][0];

  if (!resultado || resultado.mensaje === 'ERROR_BOLETO_NO_DISPONIBLE') {
    throw new AppError('Boleto no disponible o no pertenece a tu cuenta.', 404);
  }

  return { boleto: resultado };
};

const obtenerOrdenes = async (idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_eventosCompradosUsuario(?)',
    [idUsuario]
  );
  const ordenes = rows[0].filter(o => o.estadoPago === 'Pagado');
  return { ordenes };
};

module.exports = {
  obtenerPerfil,
  obtenerPerfilPublico,
  obtenerEventosComprados,
  obtenerEventosProximos,
  obtenerBoletosPorOrden,
  descargarBoleto,
  obtenerOrdenes,
};