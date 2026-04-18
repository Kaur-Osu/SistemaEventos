const jwt = require('jsonwebtoken');

// ─── Verificar token JWT ──────────────────────────────────────────────────────
// Se usa en todas las rutas protegidas. Lee el token del header Authorization.
const verifyToken = (req, res, next) => {
  // El header llega como: "Bearer eyJhbGci..."
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // disponible en todos los controladores como req.user
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado.' });
  }
};

// ─── Verificar rol ─────────────────────────────────────────────────────────────
// Fábrica de middleware: checkRole('admin') devuelve una función middleware.
// Se usa después de verifyToken: [verifyToken, checkRole('organizador')]
const checkRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, mensaje: 'No autenticado.' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        ok     : false,
        mensaje: `Acceso prohibido. Se requiere rol: ${rolesPermitidos.join(' o ')}.`,
      });
    }

    next();
  };
};

// ─── Verificar correo verificado ──────────────────────────────────────────────
// Bloquea rutas que requieren correo confirmado (ej. verificarse como organizador)
const requireCorreoVerificado = (req, res, next) => {
  if (!req.user.correoVerificado) {
    return res.status(403).json({
      ok     : false,
      mensaje: 'Debes verificar tu correo electrónico antes de continuar.',
    });
  }
  next();
};

module.exports = { verifyToken, checkRole, requireCorreoVerificado };