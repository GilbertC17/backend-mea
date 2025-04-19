const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // crea carpeta /uploads
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.post(
  '/guardar',
  upload.fields([
    { name: 'imagen_equipo', maxCount: 1 },
  ]),
  (req, res) => {
    const {
      fecha, no_economico, equipo, cia, modelo, destino,
      observaciones, checklist, usuario
    } = req.body;

    // Las rutas de los archivos subidos quedan en req.files
    const imgEquipo = req.files['imagen_equipo']?.[0]?.filename || null;

    const query = `
      INSERT INTO registros_equipo (
        fecha, no_economico, equipo, cia, modelo, destino,
        observaciones, checklist, usuario,
        imagen_equipo,
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,)
    `;
    db.query(
      query,
      [
        fecha, no_economico, equipo, cia, modelo, destino,
        observaciones,
        checklist, // ya es JSON string desde el frontend
        usuario,
        imgEquipo
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al guardar registro' });
        }
        res.json({ message: 'Registro guardado', id: result.insertId });
      }
    );
  }
);