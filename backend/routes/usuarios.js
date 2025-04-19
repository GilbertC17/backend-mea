const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); // Configuración de la conexión a la base de datos
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/firmas'); // Carpeta donde se guardarán las firmas
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
  },
});

const upload = multer({ storage });

// Ruta para registrar un nuevo usuario
router.post('/registrar', upload.single('firma'), (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, usuario, password, cargo } = req.body;
  const firma = req.file ? req.file.filename : null; // Obtener el nombre del archivo subido
  const rol = 'user'; // Rol por defecto

  const query = `
    INSERT INTO users (user, password, role, nombre, apellidoPaterno, apellidoMaterno, cargo, firma)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [usuario, password, rol, nombre, apellidoPaterno, apellidoMaterno, cargo, firma],
    (err, result) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        return res.status(500).json({ error: 'Error al registrar el usuario' });
      }
      res.json({ message: 'Usuario registrado exitosamente' });
    }
  );
});

// Ruta para obtener todos los usuarios
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }

    console.log('Resultados de la consulta:', results); // Depuración

    if (results.length > 0) {
      res.json(results[0]); // Devuelve el usuario con el campo `firma`
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});

module.exports = router;