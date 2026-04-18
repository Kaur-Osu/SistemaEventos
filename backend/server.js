require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Rutas ────────────────────────────────────────────────────────────────────
const authRoutes     = require('./src/routes/auth.routes');
const eventosRoutes  = require('./src/routes/eventos.routes');
const ordenesRoutes  = require('./src/routes/ordenes.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const adminRoutes    = require('./src/routes/admin.routes');

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Servir archivos subidos (INE, selfies, imágenes de eventos) ──────────────
// Accesibles en: http://localhost:3000/uploads/nombre-del-archivo.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Registro de rutas ────────────────────────────────────────────────────────
app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/eventos',  eventosRoutes);
app.use('/api/v1/ordenes',  ordenesRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/admin',    adminRoutes);

// ─── Ruta de salud ────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor funcionando correctamente', timestamp: new Date() });
});

// ─── Middleware de errores global ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ [Error Global]:', err.message);
  const status  = err.statusCode || 500;
  const mensaje = err.message    || 'Error interno del servidor';
  res.status(status).json({ ok: false, mensaje });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// ─── Iniciar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Ambiente: ${process.env.NODE_ENV}`);
});