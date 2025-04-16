const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Ruta para manejar el inicio de sesión
router.post('/', (req, res) => {
  const { user, password } = req.body;

  const query = 'SELECT * FROM users WHERE user = ? AND password = ?';
  db.query(query, [user, password], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length > 0) {
      const userData = results[0];
      res.json({
        message: 'Inicio de sesión exitoso',
        token: 'fake-jwt-token', // Puedes usar JWT real aquí
        role: userData.role, // Devuelve el rol del usuario
        firstName: userData.first_name, // Devuelve el nombre
        lastName: userData.last_name, // Devuelve el apellido
      });
    } else {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  });
});

module.exports = router;
