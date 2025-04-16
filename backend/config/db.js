const mysql = require('mysql2');

// Configuración del pool de conexiones
const db = mysql.createPool({
  host: 'srv654.hstgr.io',
  user: 'u108791874_admin',
  password: 'Dragonb100',
  database: 'u108791874_login_demo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
