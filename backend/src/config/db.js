const mysql = require('mysql2/promise');

// Pool de conexiones: en lugar de abrir/cerrar una conexión por cada petición,
// mantenemos un grupo reutilizable. Mucho más eficiente.
const pool = mysql.createPool({
  host    : process.env.DB_HOST     || 'localhost',
  port    : process.env.DB_PORT     || 3306,
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'sistemaeventos',
  waitForConnections: true,
  connectionLimit   : 10,    // máximo de conexiones simultáneas
  queueLimit        : 0,     // sin límite de peticiones en cola
  timezone          : '+00:00',
});

// Verificar conexión al arrancar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado a MySQL correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err.message);
    process.exit(1); // Detiene el servidor si no puede conectar
  });

module.exports = pool;