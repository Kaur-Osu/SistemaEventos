const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host  : process.env.MAIL_HOST || 'smtp.gmail.com',
  port  : parseInt(process.env.MAIL_PORT) || 587,
  secure: false, // true para 465, false para otros puertos
  auth  : {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verificar conexión al arrancar (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  transporter.verify()
    .then(() => console.log('✅ Nodemailer listo para enviar correos'))
    .catch(err => console.error('⚠️  Nodemailer no pudo conectar:', err.message));
}

// ─── Función base para enviar correos ────────────────────────────────────────
const enviarCorreo = async ({ para, asunto, html }) => {
  await transporter.sendMail({
    from   : process.env.MAIL_FROM || '"Eventos App" <noreply@eventosapp.com>',
    to     : para,
    subject: asunto,
    html,
  });
};

// ─── Templates de correo ──────────────────────────────────────────────────────


const enviarVerificacionCorreo = async (correo, nombre, token, idUsuario) => {
  const tokenEncoded = encodeURIComponent(token);
  const link = `${process.env.FRONTEND_URL}/verificar-correo/${idUsuario}/${tokenEncoded}`;
  await enviarCorreo({
    para  : correo,
    asunto: 'Verifica tu correo — Eventos App',
    html  : `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0F172A;">Hola, ${nombre} 👋</h2>
        <p style="color: #64748B;">Gracias por registrarte. Haz clic en el botón para verificar tu correo electrónico.</p>
        <a href="${link}"
           style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563EB;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Verificar mi correo
        </a>
        <p style="color:#64748B;font-size:13px;">Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });
};

/**
 * Envía el correo para restablecer contraseña.
 */
const enviarRestablecerContrasena = async (correo, nombre, token) => {
  const link = `${process.env.FRONTEND_URL}/restablecer-contrasena/${token}`;

  await enviarCorreo({
    para  : correo,
    asunto: 'Restablece tu contraseña — Eventos App',
    html  : `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0F172A;">Restablecer contraseña</h2>
        <p style="color: #64748B;">Hola <strong>${nombre}</strong>, recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${link}"
           style="display:inline-block;margin:16px 0;padding:12px 24px;background:#7C3AED;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Cambiar contraseña
        </a>
        <p style="color:#64748B;font-size:13px;">Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });
};

/**
 * Notifica al usuario el resultado de su solicitud de verificación como organizador.
 */
const enviarResultadoVerificacion = async (correo, nombre, aprobado, motivo = '') => {
  const asunto = aprobado
    ? '¡Tu cuenta de organizador fue aprobada! — Eventos App'
    : 'Tu solicitud de organizador fue rechazada — Eventos App';

  const cuerpo = aprobado
    ? `<p style="color:#10B981;">¡Felicidades, <strong>${nombre}</strong>! Tu cuenta ha sido verificada y ya puedes crear eventos en la plataforma.</p>`
    : `<p style="color:#EF4444;">Lo sentimos, <strong>${nombre}</strong>. Tu solicitud fue rechazada por el siguiente motivo:</p>
       <blockquote style="border-left:3px solid #EF4444;padding-left:12px;color:#64748B;">${motivo}</blockquote>
       <p style="color:#64748B;">Puedes volver a intentarlo desde tu perfil una vez que corrijas los documentos.</p>`;

  await enviarCorreo({
    para  : correo,
    asunto,
    html  : `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0F172A;">${asunto}</h2>
        ${cuerpo}
      </div>
    `,
  });
};

module.exports = {
  enviarVerificacionCorreo,
  enviarRestablecerContrasena,
  enviarResultadoVerificacion,
  enviarCorreo, 
};