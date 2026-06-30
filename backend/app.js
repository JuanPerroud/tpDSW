const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const Usuario = require('./models/Usuario');
const Rutinas = require('./models/Rutinas');
const Ejercicio = require('./models/Ejercicio');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);
const rutinasRoutes = require('./routes/rutinasRoutes');
app.use('/api/rutinas', rutinasRoutes);
const ejercicioRoutes = require('./routes/ejercicioRoutes');
app.use('/api/ejercicios', ejercicioRoutes);


const PORT = process.env.PORT || 3306;
sequelize.sync({ alter: true}).then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT} ✓`));
}).catch(error => {
    console.error('Error al sincronizar las tablas:', error);
});




