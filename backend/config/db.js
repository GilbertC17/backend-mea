const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'u108791874_admin', // Cambia esto si tu usuario de MySQL es diferente
  password: 'Dragonb100', // Cambia esto si tienes una contraseña configurada
  database: 'u108791874_login_demo',
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = db;
