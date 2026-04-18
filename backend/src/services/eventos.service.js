const fs = require('fs').promises;
const path = require('path');
const pool = require('../config/db');
const { AppError } = require('../utils/response');

const buildUploadUrl = (storedPath) => {
  if (!storedPath) return null;
  if (/^https?:\/\//i.test(storedPath)) return storedPath;
  const filename = path.basename(storedPath);
  const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${backendUrl}/uploads/${filename}`;
};

// ─── CATÁLOGO PÚBLICO ─────────────────────────────────────────────────────────

const listarEventosPublicos = async () => {
  const [rows] = await pool.query('CALL sp_Lista_eventosDisponiblesUsuarios()');
  return { eventos: rows[0].map(evento => ({
    ...evento,
    imagenPortada: buildUploadUrl(evento.imagenPortada),
    imagenUrl: buildUploadUrl(evento.imagenUrl)
  })) };
};

// Agrega parámetro opcional incluirPendientes
const obtenerDetalleEvento = async (idEvento, incluirPendientes = false) => {
  const [eventoRows] = await pool.query(
    `SELECT e.idEvento, e.titulo, e.descripcion, e.categoria,
            e.fecha, e.ubicacion, e.listado, e.cancelado, e.rechazado,
            u.idUsuario AS organizadorId, u.nombre AS organizadorNombre
     FROM Evento e
     INNER JOIN Usuario u ON e.idUsuario = u.idUsuario
     WHERE e.idEvento = ? AND e.cancelado = FALSE`,
    [idEvento]
  );

  const evento = eventoRows[0];
  if (!evento) throw new AppError('Evento no encontrado.', 404);

  const [zonasRows] = await pool.query('CALL sp_Lista_zonasEvento(?)', [idEvento]);

  // Si incluirPendientes=true (admin revisando), mostrar todas las imágenes
  const estadoFiltro = incluirPendientes ? `IN ('Aprobada','Pendiente')` : `= 'Aprobada'`;
  const [imagenesRows] = await pool.query(
    `SELECT idImagen, urlImagen, portada, estado
     FROM ImagenEvento
     WHERE idEvento = ? AND estado ${estadoFiltro}
     ORDER BY portada DESC`,
    [idEvento]
  );

  return {
    evento: {
      ...evento,
      zonas   : zonasRows[0],
      imagenes: imagenesRows.map((imagen) => ({
        ...imagen,
        urlImagen: buildUploadUrl(imagen.urlImagen),
      })),
    },
  };
};

// ─── ORGANIZADOR ──────────────────────────────────────────────────────────────

const misEventos = async (idUsuario) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_eventosCreadosPorUsuario(?)', [idUsuario]
  );

  // Si el SP devuelve mensaje de error (usuario no verificado)
  if (rows[0][0]?.mensaje) throw new AppError(rows[0][0].mensaje, 403);

  return { eventos: rows[0] };
};

const eventosHoy = async (idUsuario) => {
  const [rows] = await pool.query(
    `SELECT idEvento, titulo, fecha, ubicacion
     FROM Evento
     WHERE idUsuario = ? AND DATE(fecha) = CURDATE() AND cancelado = FALSE AND rechazado = FALSE`,
    [idUsuario]
  );

  return { eventos: rows };
};

const crearEvento = async (idUsuario, datos) => {
  const { titulo, descripcion, categoria, fecha, ubicacion, zonas } = datos;

  if (!zonas || zonas.length === 0) {
    throw new AppError('Debes agregar al menos una zona con precio y capacidad.', 400);
  }

  // 1. Crear el evento
  const [rows] = await pool.query(
    'CALL sp_crearEvento(?, ?, ?, ?, ?, ?)',
    [idUsuario, titulo, descripcion, categoria, fecha, ubicacion]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_FECHA_INVALIDA       : ['La fecha debe ser futura.', 400],
    ERROR_USUARIO_NO_VALIDO    : ['Usuario no válido.', 404],
    ERROR_USUARIO_NO_VERIFICADO: ['Debes estar verificado como organizador.', 403],
    ERROR_LIMITE_EVENTOS       : ['Alcanzaste el límite de eventos activos.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  const idEvento = resultado.idEvento;

  // 2. Agregar zonas al evento recién creado
  for (const zona of zonas) {
    const [zonaRows] = await pool.query(
      'CALL sp_agregarZonaEvento(?, ?, ?, ?, ?)',
      [idUsuario, idEvento, zona.nombre, zona.precio, zona.capacidad]
    );

    const resZona = zonaRows[0][0];
    if (resZona.mensaje !== 'OK') {
      throw new AppError(`Error en zona "${zona.nombre}": ${resZona.mensaje}`, 400);
    }
  }

  return { mensaje: 'Evento creado correctamente.', idEvento };
};

const editarEvento = async (idUsuario, idEvento, datos) => {
  const { titulo, descripcion, categoria, fecha, ubicacion } = datos;

  const [rows] = await pool.query(
    'CALL sp_modificarEventoNoListado(?, ?, ?, ?, ?, ?, ?)',
    [idUsuario, idEvento, titulo, descripcion, categoria, fecha, ubicacion]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_EVENTO_NO_VALIDO: ['Evento no encontrado.', 404],
    ERROR_EVENTO_CANCELADO: ['El evento está cancelado.', 400],
    // ← ERROR_EVENTO_LISTADO removido intencionalmente
    // Al guardar cambios en un evento publicado, la ruta lo vuelve a revisión
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  // Si el SP rechaza porque está listado, hacemos UPDATE directo
  if (resultado.mensaje === 'ERROR_EVENTO_LISTADO') {
    await pool.query(
      `UPDATE Evento SET titulo=?, descripcion=?, categoria=?, fecha=?, ubicacion=?, listado=FALSE
       WHERE idEvento=? AND idUsuario=?`,
      [titulo, descripcion, categoria, fecha, ubicacion, idEvento, idUsuario]
    );
  }

  return { mensaje: 'Evento actualizado. Enviado a revisión nuevamente.' };
};

const publicarEvento = async (idUsuario, idEvento) => {
  const [rows] = await pool.query(
    'CALL sp_listarEvento(?, ?)', [idUsuario, idEvento]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_EVENTO_NO_VALIDO        : ['Evento no encontrado.', 404],
    ERROR_EVENTO_CANCELADO        : ['El evento está cancelado.', 400],
    ERROR_EVENTO_YA_LISTADO       : ['El evento ya está publicado.', 400],
    ERROR_SIN_ZONAS_CONFIGURADAS  : ['Debes agregar al menos una zona antes de publicar.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: 'Evento publicado en el catálogo correctamente.' };
};

const cancelarEvento = async (idUsuario, idEvento) => {
  const [rows] = await pool.query(
    'CALL sp_cancelarEventoNoListado(?, ?)', [idUsuario, idEvento]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_EVENTO_NO_VALIDO   : ['Evento no encontrado.', 404],
    ERROR_EVENTO_YA_CANCELADO: ['El evento ya estaba cancelado.', 400],
    ERROR_EVENTO_LISTADO     : ['No puedes cancelar un evento publicado. Solicita una cancelación.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: 'Evento cancelado correctamente.' };
};

// ─── ZONAS ────────────────────────────────────────────────────────────────────

const agregarZona = async (idUsuario, idEvento, zona) => {
  const [rows] = await pool.query(
    'CALL sp_agregarZonaEvento(?, ?, ?, ?, ?)',
    [idUsuario, idEvento, zona.nombre, zona.precio, zona.capacidad]
  );

  const resultado = rows[0][0];
  if (resultado.mensaje !== 'OK') {
    throw new AppError(resultado.mensaje, 400);
  }

  return { mensaje: 'Zona agregada correctamente.', idZona: resultado.idZona };
};

const editarZona = async (idUsuario, idZona, zona) => {
  const [rows] = await pool.query(
    'CALL sp_modificarZonaEvento(?, ?, ?, ?, ?)',
    [idUsuario, idZona, zona.nombre, zona.precio, zona.capacidad]
  );

  const resultado = rows[0][0];
  if (resultado.mensaje !== 'OK') {
    throw new AppError(resultado.mensaje, 400);
  }

  return { mensaje: 'Zona actualizada correctamente.' };
};

const eliminarZona = async (idUsuario, idZona) => {
  const [rows] = await pool.query(
    'CALL sp_eliminarZonaEvento(?, ?)', [idUsuario, idZona]
  );

  const resultado = rows[0][0];
  if (resultado.mensaje !== 'OK') {
    throw new AppError(resultado.mensaje, 400);
  }

  return { mensaje: 'Zona eliminada correctamente.' };
};

const obtenerZonasEvento = async (idEvento) => {
  const [rows] = await pool.query(
    'CALL sp_Lista_zonasEvento(?)', [idEvento]
  );
  return { zonas: rows[0] };
};

// ─── IMÁGENES ─────────────────────────────────────────────────────────────────

const subirImagen = async (idUsuario, idEvento, urlImagen, esPortada) => {
  const [rows] = await pool.query(
    'CALL sp_subirImagenEvento(?, ?, ?, ?)',
    [idUsuario, idEvento, urlImagen, esPortada]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_EVENTO_NO_VALIDO: ['Evento no encontrado.', 404],
    ERROR_EVENTO_CANCELADO: ['El evento está cancelado.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: 'Imagen subida. Pendiente de aprobación.', idImagen: resultado.idImagen };
};

const quitarImagen = async (idUsuario, idImagen) => {
  const [rows] = await pool.query(
    'CALL sp_quitarImagenEvento(?, ?)', [idUsuario, idImagen]
  );

  const resultado = rows[0][0];

  if (resultado.mensaje === 'ERROR_IMAGEN_NO_VALIDA') {
    throw new AppError('Imagen no encontrada o no pertenece a tu evento.', 404);
  }

  if (resultado.urlEliminada) {
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      const url = resultado.urlEliminada;
      const filename = path.basename(url);
      const filePath = path.isAbsolute(url)
        ? url
        : path.join(uploadsDir, filename);
      await fs.unlink(filePath);
    } catch (err) {
      console.warn('⚠️  No se pudo borrar la imagen local:', err.message);
    }
  }

  return { mensaje: 'Imagen eliminada correctamente.' };
};

// ─── SOLICITUDES (eventos listados) ──────────────────────────────────────────

const solicitarModificacion = async (idUsuario, idEvento, causa) => {
  const [rows] = await pool.query(
    'CALL sp_solicitarModificarEventoListado(?, ?, ?)',
    [idUsuario, idEvento, causa]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_EVENTO_NO_VALIDO  : ['Evento no encontrado.', 404],
    ERROR_EVENTO_CANCELADO  : ['El evento está cancelado.', 400],
    ERROR_EVENTO_NO_LISTADO : ['El evento no está publicado.', 400],
    ERROR_YA_EXISTE_SOLICITUD: ['Ya tienes una solicitud pendiente para este evento.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: 'Solicitud de modificación enviada al administrador.' };
};

const solicitarCancelacion = async (idUsuario, idEvento, causa) => {
  const [rows] = await pool.query(
    'CALL sp_solicitarCancelarEventoListado(?, ?, ?)',
    [idUsuario, idEvento, causa]
  );

  const resultado = rows[0][0];

  const errores = {
    ERROR_EVENTO_NO_VALIDO   : ['Evento no encontrado.', 404],
    ERROR_EVENTO_YA_CANCELADO: ['El evento ya está cancelado.', 400],
    ERROR_EVENTO_NO_LISTADO  : ['El evento no está publicado.', 400],
    ERROR_YA_EXISTE_SOLICITUD: ['Ya tienes una solicitud pendiente para este evento.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: 'Solicitud de cancelación enviada al administrador.' };
};

// Agrega una función separada para el organizador
const obtenerDetalleEventoOrganizador = async (idEvento, idUsuario) => {
  const [eventoRows] = await pool.query(
    `SELECT e.idEvento, e.titulo, e.descripcion, e.categoria,
            e.fecha, e.ubicacion, e.listado, e.cancelado,
            u.idUsuario AS organizadorId, u.nombre AS organizadorNombre
     FROM Evento e
     INNER JOIN Usuario u ON e.idUsuario = u.idUsuario
     WHERE e.idEvento = ? AND e.cancelado = FALSE AND e.idUsuario = ?`,
    [idEvento, idUsuario]
  );

  const evento = eventoRows[0];
  if (!evento) throw new AppError('Evento no encontrado.', 404);

  const [zonasRows]    = await pool.query('CALL sp_Lista_zonasEvento(?)', [idEvento]);
  // Para el organizador: ver TODAS sus imágenes (pendientes + aprobadas)
  const [imagenesRows] = await pool.query(
    `SELECT idImagen, urlImagen, portada, estado
     FROM ImagenEvento
     WHERE idEvento = ?
     ORDER BY portada DESC, idImagen DESC`,
    [idEvento]
  );

  return {
    evento: {
      ...evento,
      zonas   : zonasRows[0],
      imagenes: imagenesRows.map((imagen) => ({
        ...imagen,
        urlImagen: buildUploadUrl(imagen.urlImagen),
      })),
    },
  };
};

module.exports = {
  listarEventosPublicos,
  obtenerDetalleEvento,
  misEventos,
  eventosHoy,
  crearEvento,
  editarEvento,
  publicarEvento,
  cancelarEvento,
  agregarZona,
  editarZona,
  eliminarZona,
  obtenerZonasEvento,
  subirImagen,
  quitarImagen,
  solicitarModificacion,
  solicitarCancelacion,
  obtenerDetalleEventoOrganizador,
};