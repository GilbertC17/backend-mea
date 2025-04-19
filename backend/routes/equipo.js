const express = require('express');
const db = require('../config/db');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración especial para Render
// Ruta de uploads compatible con Render y local
const uploadDir = process.env.RENDER
  ? '/tmp/uploads/imgequipos'  // Usa /tmp en Render
  : path.join(__dirname, '../uploads/imgequipos'); // Ruta para tu entorno local

// Crear directorio si no existe (al iniciar)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura Multer para imágenes de equipo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Usar la carpeta 'imgequipos'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueSuffix); // Generar un nombre único para el archivo
  }
});

const upload = multer({ storage: storage });

// Servir los archivos estáticos desde la carpeta 'imgequipos'
router.use('/uploads/imgequipos', express.static(uploadDir));

// Ruta para guardar el formulario de equipo
router.post('/guardar', upload.fields([{ name: 'imagen_equipo' }]), (req, res) => {
  console.log('Datos recibidos:', {
    body: req.body,
    files: req.files,
    usuario: req.body.usuario
  });

  // Verificar campos obligatorios
  if (!req.body.usuario) {
    return res.status(400).json({ error: 'El campo usuario es requerido' });
  }

  const {
    fecha,
    no_economico,
    equipo,
    cia,
    modelo,
    destino,
    observaciones,
    checklist,
    usuario
  } = req.body;

  // Obtenemos el nombre de la imagen subida
  const imagen_equipo = req.files['imagen_equipo']?.[0]?.filename || null;

  // Validación básica
  if (!fecha || !no_economico || !equipo || !usuario) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar que el checklist es un JSON válido
    const parsedChecklist = JSON.parse(checklist);
    if (!Array.isArray(parsedChecklist)) {
      throw new Error('Checklist inválido');
    }
  } catch (e) {
    return res.status(400).json({ error: 'Formato de checklist inválido' });
  }

  const query = `
    INSERT INTO registros_equipo (
      fecha, no_economico, equipo, cia, modelo, destino, observaciones,
      imagen_equipo, checklist, usuario
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      fecha,
      no_economico,
      equipo,
      cia || null,
      modelo || null,
      destino || null,
      observaciones || null,
      imagen_equipo,
      checklist,
      usuario
    ],
    (err, result) => {
      if (err) {
        console.error('Error en la consulta SQL:', err);
        return res.status(500).json({ 
          error: 'Error al guardar en base de datos',
          details: err.message 
        });
      }
      res.json({ 
        message: 'Registro guardado exitosamente',
        id: result.insertId 
      });
    }
  );
});

// Ruta para obtener registros por fecha
router.get('/registros/fecha', (req, res) => {
  const { fecha } = req.query; // Obtener la fecha desde los parámetros de consulta
  const query = 'SELECT * FROM registros_equipo WHERE fecha = ?';
  db.query(query, [fecha], (err, results) => {
    if (err) {
      console.error('Error al obtener los registros por fecha:', err);
      return res.status(500).json({ error: 'Error al obtener los registros por fecha' });
    }
    res.json(results); // Devuelve los registros filtrados
  });
});

// Ruta para eliminar un registro
router.delete('/registros/:id', (req, res) => {
  const { id } = req.params; // Obtener el ID del registro desde los parámetros de la URL

  const query = 'DELETE FROM registros_equipo WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el registro:', err);
      return res.status(500).json({ error: 'Error al eliminar el registro' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.json({ message: 'Registro eliminado exitosamente' });
  });
});

// Ruta para obtener todos los registros
router.get('/registros', (req, res) => {
  const query = `
    SELECT
      r.*,
      u.firma AS firma
    FROM
      registros_equipo r
    LEFT JOIN
      users u ON r.usuario = u.user
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      return res.status(500).json({ error: 'Error al obtener los registros' });
    }
    res.json(results); // Devuelve los registros con la firma del inspector
  });
});

console.log('Imagen guardada en:', path.join(__dirname, '../uploads/imgequipos', filename));

module.exports = router;
