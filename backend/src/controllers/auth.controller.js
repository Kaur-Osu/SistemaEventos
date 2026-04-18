const { decode } = require('punycode');
const authService = require('../services/auth.service');
const { ok, created } = require('../utils/response');

// Los controladores son delgados: reciben req, llaman al service, responden.
// Toda la lógica de negocio vive en auth.service.js.
// Los errores que lanza el service son capturados por el middleware global de server.js.

const registroCtrl = async (req, res, next) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const data = await authService.registro({ nombre, correo, contrasena });
    return created(res, data);
  } catch (err) { next(err); }
};

const loginCtrl = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Correo y contraseña son obligatorios.' });
    }

    const data = await authService.login({ correo, contrasena });
    return ok(res, data);
  } catch (err) { next(err); }
};

const loginAdminCtrl = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;
    const data = await authService.loginAdmin({ correo, contrasena });
    return ok(res, data);
  } catch (err) { next(err); }
};

const verificarCorreoCtrl = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const token = decodeURIComponent(req.params.token); 
    const data = await authService.verificarCorreo(parseInt(idUsuario), token);
    return ok(res, data);
  } catch (err) { next(err); }
};

const reenviarVerificacionCtrl = async (req, res, next) => {
  try {
    // req.user viene del middleware verifyToken
    const data = await authService.reenviarVerificacion(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};

const recuperarContrasenaCtrl = async (req, res, next) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ ok: false, mensaje: 'El correo es obligatorio.' });

    const data = await authService.solicitarRestablecimiento(correo);
    return ok(res, data);
  } catch (err) { next(err); }
};

const restablecerContrasenaCtrl = async (req, res, next) => {
  try {
    const { token }          = req.params;
    const { nuevaContrasena } = req.body;

    if (!nuevaContrasena || nuevaContrasena.length < 6) {
      return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const data = await authService.restablecerContrasena(token, nuevaContrasena);
    return ok(res, data);
  } catch (err) { next(err); }
};

const cambiarContrasenaCtrl = async (req, res, next) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;

    if (!contrasenaActual || !contrasenaNueva) {
      return res.status(400).json({ ok: false, mensaje: 'Ambas contraseñas son obligatorias.' });
    }

    if (contrasenaNueva.length < 6) {
      return res.status(400).json({ ok: false, mensaje: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    const data = await authService.cambiarContrasena(req.user.idUsuario, contrasenaActual, contrasenaNueva);
    return ok(res, data);
  } catch (err) { next(err); }
};

const verificarseCtrl = async (req, res, next) => {
  try {
    const ineFile    = req.files?.ine?.[0];
    const selfieFile = req.files?.selfie?.[0];

    if (!ineFile || !selfieFile) {
      return res.status(400).json({ ok: false, mensaje: 'Debes subir tu INE y selfie.' });
    }

    const { curp, cuentaBancaria, banco } = req.body;
    if (!curp || !cuentaBancaria || !banco) {
      return res.status(400).json({ ok: false, mensaje: 'CURP, cuenta bancaria y banco son obligatorios.' });
    }

    // Usamos el nombre del archivo como referencia; la URL pública se genera al mostrarlo
    const inePath    = ineFile.filename;
    const selfiePath = selfieFile.filename;

    const data = await authService.verificarse(req.user.idUsuario, {
      inePath, selfiePath, curp, cuentaBancaria, banco,
    });

    return ok(res, data);
  } catch (err) { next(err); }
};

const meCtrl = async (req, res, next) => {
  try {
    const data = await authService.obtenerUsuario(req.user.idUsuario);
    return ok(res, data);
  } catch (err) { next(err); }
};


module.exports = {
  registroCtrl,
  loginCtrl,
  loginAdminCtrl,
  verificarCorreoCtrl,
  reenviarVerificacionCtrl,
  recuperarContrasenaCtrl,
  restablecerContrasenaCtrl,
  cambiarContrasenaCtrl,
  verificarseCtrl,
  meCtrl,
};