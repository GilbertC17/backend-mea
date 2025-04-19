const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./config/db');
const equipoRoutes = require('./routes/equipo');
const path = require('path');
const usuariosRoutes = require('./routes/usuarios'); // Importar la nueva ruta

const app = express(); // Define 'app' antes de usarlo
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/uploads/firmas', express.static(path.join(__dirname, 'uploads/firmas')));

// Rutas
app.use('/login', authRoutes);
app.use('/equipo', equipoRoutes);
app.use('/usuarios', usuariosRoutes); // Registrar la nueva ruta


// Ruta para verificar el estado del servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});