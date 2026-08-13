const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importamos todos los modelos actualizados desde ./models/index.js
const {
  sequelize,
  User,
  Routine,
  Exercise,
  RoutineExercise,
  ExerciseSet
} = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const mainRoutes = require("./routes/mainRoutes");
app.use("/", mainRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const routineRoutes = require("./routes/routineRoutes");
app.use("/api/routine", routineRoutes);

const exerciseRoutes = require("./routes/exerciseRoutes");
app.use("/api/exercise", exerciseRoutes);

const PORT = process.env.PORT || 3000;

// Sincronización de la base de datos
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en puerto ${PORT} ✓`),
    );
  })
  .catch((error) => {
    console.error("Error al sincronizar las tablas:", error);
  });