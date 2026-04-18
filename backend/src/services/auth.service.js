const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');
const email  = require('../utils/email');
const { AppError } = require('../utils/response');

// ─── Helper: derivar rol del usuario ─────────────────────────────────────────
// El rol NO está en la BD como columna. Se calcula a partir de datosVerificados
// y estadoVerificacion. Un organizador también puede comprar boletos.
const derivarRol = (datosVerificados, estadoVerificacion) => {
  if (datosVerificados && estadoVerificacion === 'Aprobada') return 'organizador';
  return 'cliente';
};

// ─── Helper: generar JWT ───────────────────────────────────────────────────────
const generarToken = (usuario) => {
  return jwt.sign(
    {
      idUsuario          : usuario.idUsuario,
      nombre             : usuario.nombre,
      correo             : usuario.correo,
      rol                : derivarRol(usuario.datosVerificados, usuario.estadoVerificacion),
      datosVerificados   : usuario.datosVerificados,
      estadoVerificacion : usuario.estadoVerificacion,
      correoVerificado   : usuario.correoVerificado,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── Registro de usuario ──────────────────────────────────────────────────────
const registro = async ({ nombre, correo, contrasena }) => {
  // 1. Hashear la contraseña (10 rounds es el estándar)
  const hash = await bcrypt.hash(contrasena, 10);

  // 2. Llamar al stored procedure
  const [rows] = await pool.query(
    'CALL sp_registrarse(?, ?, ?, NULL, NULL, NULL, NULL, NULL)',
    [nombre, correo, hash]
  );

  const resultado = rows[0][0];
  console.log('Resultado del SP registro:', resultado);


  if (resultado.mensaje === 'ERROR_CORREO_EXISTENTE') {
    throw new AppError('Este correo ya está registrado.', 409);
  }

 // ── Fix: buscar el idUsuario con cualquier nombre que devuelva el SP ──
const idUsuario = resultado.idUsuario 
  ?? resultado.id 
  ?? resultado.nuevoId 
  ?? resultado.insertId
  ?? null;

if (!idUsuario) {
  throw new AppError('No se pudo obtener el ID del usuario registrado.', 500);
}

// Generar token de verificación
const [tokenRows] = await pool.query(
  'CALL sp_generarTokenVerificacionCorreo(?)',
  [idUsuario]
);
const { token } = tokenRows[0][0];

email.enviarVerificacionCorreo(correo, nombre, token, idUsuario).catch(err =>
  console.error('⚠️ Error enviando correo:', err.message)
);

return {
  mensaje  : 'Cuenta creada. Revisa tu correo para verificar tu cuenta.',
  idUsuario: idUsuario,
};
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ correo, contrasena }) => {
  // NOTA: No usamos sp_login_usuario directamente porque ese SP compara contraseñas
  // en texto plano. Nosotros guardamos hashes de bcrypt, así que obtenemos
  // al usuario por correo y comparamos el hash en Node.js.
  const [rows] = await pool.query(
    `SELECT idUsuario, nombre, correo, contrasena, datosVerificados,
            estadoVerificacion, correoVerificado, activo
     FROM Usuario
     WHERE correo = ? AND activo = TRUE
     LIMIT 1`,
    [correo]
  );

  const usuario = rows[0];

  if (!usuario) {
    throw new AppError('Correo o contraseña incorrectos.', 401);
  }

  // Comparar contraseña con el hash almacenado
  const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordValida) {
    throw new AppError('Correo o contraseña incorrectos.', 401);
  }

  // Generar y devolver el token
  const token = generarToken(usuario);

  return {
    token,
    usuario: {
      idUsuario        : usuario.idUsuario,
      nombre           : usuario.nombre,
      correo           : usuario.correo,
      rol              : derivarRol(usuario.datosVerificados, usuario.estadoVerificacion),
      datosVerificados : usuario.datosVerificados,
      estadoVerificacion: usuario.estadoVerificacion,
      correoVerificado : usuario.correoVerificado,
    },
  };
};

// ─── Login de administrador ───────────────────────────────────────────────────
const loginAdmin = async ({ correo, contrasena }) => {
  const [rows] = await pool.query(
    `SELECT idAdministrador, nombre, correo, contrasena, dueno, activo
     FROM Administrador
     WHERE correo = ? AND activo = TRUE
     LIMIT 1`,
    [correo]
  );

  const admin = rows[0];

  if (!admin) {
    throw new AppError('Correo o contraseña incorrectos.', 401);
  }

  const passwordValida = await bcrypt.compare(contrasena, admin.contrasena);
  if (!passwordValida) {
    throw new AppError('Correo o contraseña incorrectos.', 401);
  }

  const token = jwt.sign(
    {
      idAdministrador: admin.idAdministrador,
      nombre         : admin.nombre,
      correo         : admin.correo,
      rol            : 'admin',
      dueno          : admin.dueno,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    token,
    usuario: {
      idAdministrador: admin.idAdministrador,
      nombre         : admin.nombre,
      correo         : admin.correo,
      rol            : 'admin',
      dueno          : admin.dueno,
    },
  };
};

// ─── Verificar correo con token ───────────────────────────────────────────────
const verificarCorreo = async (idUsuario, token) => {
  const [rows] = await pool.query(
    'CALL sp_verificarCorreo(?, ?)',
    [idUsuario, token]
  );

  const resultado = rows[0][0];

  if (resultado.mensaje !== 'OK') {
    throw new AppError('El enlace de verificación es inválido o ha expirado.', 400);
  }

  return { mensaje: 'Correo verificado correctamente. Ya puedes iniciar sesión.' };
};

// ─── Reenviar correo de verificación ─────────────────────────────────────────
const reenviarVerificacion = async (idUsuario) => {
  // Obtener datos del usuario para el correo
  const [userRows] = await pool.query(
    'SELECT nombre, correo, correoVerificado FROM Usuario WHERE idUsuario = ? AND activo = TRUE',
    [idUsuario]
  );

  const usuario = userRows[0];
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);
  if (usuario.correoVerificado) throw new AppError('El correo ya fue verificado.', 400);

  const [tokenRows] = await pool.query(
    'CALL sp_generarTokenVerificacionCorreo(?)',
    [idUsuario]
  );

  const resultado = tokenRows[0][0];
  if (resultado.mensaje !== 'OK') {
    throw new AppError('No se pudo generar el token de verificación.', 500);
  }

  await email.enviarVerificacionCorreo(usuario.correo, usuario.nombre, resultado.token);

  return { mensaje: 'Correo de verificación reenviado.' };
};

// ─── Solicitar restablecimiento de contraseña ─────────────────────────────────
const solicitarRestablecimiento = async (correo) => {
  // Obtenemos nombre antes de llamar al SP para el correo
  const [userRows] = await pool.query(
    'SELECT nombre FROM Usuario WHERE correo = ? AND activo = TRUE LIMIT 1',
    [correo]
  );

  // Por seguridad, no revelar si el correo existe o no
  if (!userRows[0]) {
    return { mensaje: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' };
  }

  const [rows] = await pool.query(
    'CALL sp_generarTokenRestablecerContrasenaUsuario(?)',
    [correo]
  );

  const resultado = rows[0][0];

  if (resultado.mensaje === 'OK') {
    await email.enviarRestablecerContrasena(correo, userRows[0].nombre, resultado.token);
  }

  return { mensaje: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' };
};

// ─── Restablecer contraseña con token ────────────────────────────────────────
const restablecerContrasena = async (token, nuevaContrasena) => {
  const hash = await bcrypt.hash(nuevaContrasena, 10);

  const [rows] = await pool.query(
    'CALL sp_restablecerContrasena(?, ?)',
    [token, hash]
  );

  const resultado = rows[0][0];

  if (resultado.mensaje !== 'OK') {
    throw new AppError('El enlace es inválido o ha expirado.', 400);
  }

  return { mensaje: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' };
};

// ─── Cambiar contraseña (usuario logueado) ────────────────────────────────────
const cambiarContrasena = async (idUsuario, contrasenaActual, contrasenaNueva) => {
  // Obtener hash actual
  const [rows] = await pool.query(
    'SELECT contrasena FROM Usuario WHERE idUsuario = ? AND activo = TRUE',
    [idUsuario]
  );

  if (!rows[0]) throw new AppError('Usuario no encontrado.', 404);

  const valida = await bcrypt.compare(contrasenaActual, rows[0].contrasena);
  if (!valida) throw new AppError('La contraseña actual es incorrecta.', 400);

  const nuevoHash = await bcrypt.hash(contrasenaNueva, 10);

  // Usamos query directo con el hash nuevo (el SP también compara en texto plano)
  await pool.query(
    'UPDATE Usuario SET contrasena = ? WHERE idUsuario = ?',
    [nuevoHash, idUsuario]
  );

  return { mensaje: 'Contraseña actualizada correctamente.' };
};


// ─── Enviar documentos para verificarse como organizador ─────────────────────
const verificarse = async (idUsuario, { inePath, selfiePath, curp, cuentaBancaria, banco }) => {
  console.log('Parámetros enviados al SP:', { idUsuario, inePath, selfiePath, curp, cuentaBancaria, banco });

  const [rows] = await pool.query(
    'CALL sp_verificarse(?, ?, ?, ?, ?, ?)',
    [idUsuario, inePath, selfiePath, curp, cuentaBancaria, banco]
  );

  console.log('Respuesta completa del SP:', rows);

  const resultado = rows[0] && rows[0][0] ? rows[0][0] : null;


  if (!resultado) {
    throw new AppError('El procedimiento no devolvió resultados.', 500);
  }

  const errores = {
    ERROR_USUARIO_NO_VALIDO    : ['Usuario no válido.', 404],
    ERROR_CORREO_NO_VERIFICADO : ['Debes verificar tu correo antes de enviar documentos.', 403],
    ERROR_USUARIO_YA_VERIFICADO: ['Tu cuenta ya fue verificada como organizador.', 400],
    ERROR_DATOS_INCOMPLETOS    : ['Todos los documentos son obligatorios.', 400],
  };

  if (errores[resultado.mensaje]) {
    const [msg, code] = errores[resultado.mensaje];
    throw new AppError(msg, code);
  }

  return { mensaje: 'Solicitud enviada. Un administrador revisará tus documentos en 24–48 horas.' };
};

// ─── Obtener datos frescos del usuario autenticado ────────────────────────────
// Usado por GET /auth/me para refrescar el contexto sin re-logear
const obtenerUsuario = async (idUsuario) => {
  const [rows] = await pool.query(
    `SELECT idUsuario, nombre, correo, datosVerificados,
            estadoVerificacion, correoVerificado, activo,
            banco, cuentaBancaria, curp
     FROM Usuario
     WHERE idUsuario = ? AND activo = TRUE
     LIMIT 1`,
    [idUsuario]
  );

  const usuario = rows[0];
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);

  return {
    usuario: {
      idUsuario         : usuario.idUsuario,
      nombre            : usuario.nombre,
      correo            : usuario.correo,
      rol               : derivarRol(usuario.datosVerificados, usuario.estadoVerificacion),
      datosVerificados  : usuario.datosVerificados,
      estadoVerificacion: usuario.estadoVerificacion,
      correoVerificado  : usuario.correoVerificado,
      banco             : usuario.banco,
      cuentaBancaria    : usuario.cuentaBancaria,
      curp              : usuario.curp,
    },
  };
};


module.exports = {
  registro,
  login,
  loginAdmin,
  verificarCorreo,
  reenviarVerificacion,
  solicitarRestablecimiento,
  restablecerContrasena,
  cambiarContrasena,
  verificarse,
  obtenerUsuario,
};