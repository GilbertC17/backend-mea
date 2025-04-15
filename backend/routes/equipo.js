const express = require('express');
const db = require('../config/db'); // Configuración de la conexión a la base de datos
const router = express.Router();

router.get('/registros', (req, res) => {
  const query = 'SELECT * FROM registros_equipo';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      return res.status(500).json({ error: 'Error al obtener los registros' });
    }
    res.json(results); // Devuelve todos los registros
  });
});

// Ruta para guardar el formulario de equipo
router.post('/guardar', (req, res) => {
  const {
    fecha,
    no_economico,
    equipo,
    cia,
    modelo,
    destino,
    observaciones,
    firma_inspeccion,
    firma_aprobacion,
    checklist,
    usuario,
  } = req.body;

  const query = `
    INSERT INTO registros_equipo (
      fecha, no_economico, equipo, cia, modelo, destino, observaciones,
      firma_inspeccion, firma_aprobacion, checklist, usuario
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      fecha,
      no_economico,
      equipo,
      cia,
      modelo,
      destino,
      observaciones,
      firma_inspeccion,
      firma_aprobacion,
      JSON.stringify(checklist), // Convertir el checklist a JSON
      usuario,
    ],
    (err, result) => {
      if (err) {
        console.error('Error al guardar el registro:', err);
        return res.status(500).json({ error: 'Error al guardar el registro' });
      }
      res.json({ message: 'Registro guardado exitosamente' });
    }
  );
});

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

module.exports = router;