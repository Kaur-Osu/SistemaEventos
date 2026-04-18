// ─── Clase de error personalizado ────────────────────────────────────────────
// Permite lanzar errores con código HTTP desde cualquier servicio.
// El middleware de errores global en server.js los captura.
//
// Uso: throw new AppError('Correo ya registrado', 409)
class AppError extends Error {
  constructor(mensaje, statusCode = 500) {
    super(mensaje);
    this.statusCode = statusCode;
    this.name       = 'AppError';
  }
}

// ─── Helpers de respuesta estandarizada ──────────────────────────────────────
// Todos los endpoints responden con el mismo formato { ok, data } o { ok, mensaje }

const ok = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({ ok: true, ...data });
};

const created = (res, data = {}) => ok(res, data, 201);

const error = (res, mensaje = 'Error interno', statusCode = 500) => {
  return res.status(statusCode).json({ ok: false, mensaje });
};

module.exports = { AppError, ok, created, error };