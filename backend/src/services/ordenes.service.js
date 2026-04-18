const pool = require('../config/db');
const { AppError } = require('../utils/response');

// ─── CREAR ORDEN (reservar boletos) ───────────────────────────────────────────
const crearOrden = async (idUsuario, idEvento, idZona, cantidad) => {
  const [rows] = await pool.query(
    'CALL sp_comprarBoletos(?, ?, ?, ?)',
    [idUsuario, idEvento, idZona, cantidad]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_USUARIO_NO_VALIDO             : ['Usuario no válido.', 404],
    ERROR_CANTIDAD_INVALIDA             : ['La cantidad debe ser mayor a 0.', 400],
    ERROR_ZONA_NO_EXISTE                : ['La zona seleccionada no existe.', 404],
    ERROR_ZONA_NO_PERTENECE_AL_EVENTO   : ['La zona no pertenece a este evento.', 400],
    ERROR_EVENTO_NO_DISPONIBLE          : ['El evento no está disponible.', 400],
    ERROR_SIN_DISPONIBILIDAD            : ['No hay suficientes boletos disponibles en esta zona.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return {
    mensaje        : 'Boletos reservados. Tienes 10 minutos para completar el pago.',
    idOrden        : resultado.idOrden,
    precioPorBoleto: resultado.precioPorBoleto,
    total          : resultado.precioPorBoleto * cantidad,
    expiracion     : new Date(Date.now() + 10 * 60 * 1000), // 10 min desde ahora
  };
};

// ─── REGISTRAR PAGO ───────────────────────────────────────────────────────────
const registrarPago = async (idOrden, cantidadPagada) => {
  const [rows] = await pool.query(
    'CALL sp_registrarPago(?, ?)',
    [idOrden, cantidadPagada]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_ORDEN_INVALIDA_O_EXPIRADA: ['La orden no existe o ya expiró. Los boletos fueron liberados.', 400],
    ERROR_ORDEN_YA_PAGADA          : ['Esta orden ya fue pagada anteriormente.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: '¡Pago registrado! Tus boletos están activos.' };
};

// ─── DETALLES DE UNA ORDEN ────────────────────────────────────────────────────
const detallesOrden = async (idUsuario, idOrden) => {
  // Verificar que la orden pertenece al usuario
  const [check] = await pool.query(
    'SELECT idOrden, fechaExpiracion FROM Orden WHERE idOrden = ? AND idUsuario = ?',
    [idOrden, idUsuario]
  );

  if (!check[0]) throw new AppError('Orden no encontrada.', 404);

  const [rows] = await pool.query(
    'CALL sp_Lista_detallesOrden(?)', [idOrden]
  );

  return { orden: rows[0] };
};

// ─── EMITIR RECIBO ────────────────────────────────────────────────────────────
const emitirRecibo = async (idUsuario, idOrden) => {
  // Verificar que la orden pertenece al usuario
  const [check] = await pool.query(
    'SELECT idOrden FROM Orden WHERE idOrden = ? AND idUsuario = ?',
    [idOrden, idUsuario]
  );

  if (!check[0]) throw new AppError('Orden no encontrada.', 404);

  const [rows] = await pool.query(
    'CALL sp_emitirRecibo(?)', [idOrden]
  );

  const resultado = rows[0][0];

  if (resultado?.mensaje === 'ERROR_ORDEN_SIN_PAGO') {
    throw new AppError('Esta orden aún no ha sido pagada.', 400);
  }

  return { recibo: rows[0] };
};

// ─── USAR BOLETO (escaneo en puerta) ─────────────────────────────────────────
const usarBoleto = async (codigoQR, idEvento) => {
  const [rows] = await pool.query(
    'CALL sp_usarBoleto(?, ?)',
    [codigoQR, idEvento]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_BOLETO_NO_EXISTE_EN_EVENTO: ['El boleto no corresponde a este evento.', 404],
    ERROR_BOLETO_NO_VALIDO          : ['El boleto no es válido o ya fue usado.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: '✅ Boleto válido. Acceso permitido.' };
};

// ─── CANCELAR SOLICITUD DE EVENTO ────────────────────────────────────────────
const cancelarSolicitud = async (idUsuario, idSolicitud) => {
  const [rows] = await pool.query(
    'CALL sp_cancelarSolicitudEvento(?, ?)',
    [idUsuario, idSolicitud]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_SOLICITUD_NO_VALIDA    : ['Solicitud no encontrada.', 404],
    ERROR_SOLICITUD_NO_PENDIENTE : ['La solicitud ya fue resuelta.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: 'Solicitud cancelada correctamente.' };
};

module.exports = {
  crearOrden,
  registrarPago,
  detallesOrden,
  emitirRecibo,
  usarBoleto,
  cancelarSolicitud,
};