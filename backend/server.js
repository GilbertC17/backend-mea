const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./config/db');
const equipoRoutes = require('./routes/equipo');

const app = express(); // Define 'app' antes de usarlo
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/login', authRoutes);
app.use('/equipo', equipoRoutes);

// Ruta para verificar el estado del servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});