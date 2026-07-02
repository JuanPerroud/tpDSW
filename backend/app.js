const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const User = require('./models/User');
const Routine = require('./models/Routine');
const Exercise= require('./models/Exercise');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);
const routineRoutes = require('./routes/routineRoutes');
app.use('/api/routine', routineRoutes);
const exerciseRoutes = require('./routes/exerciseRoutes');
app.use('/api/exercise', exerciseRoutes);


const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true}).then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT} ✓`));
}).catch(error => {
    console.error('Error al sincronizar las tablas:', error);
});




