require("dotenv").config();

// Importamos todos los modelos desde ./models/index.js (registra las asociaciones)
const { sequelize } = require("./models");
const app = require("./app");

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error("Falta la variable de entorno JWT_SECRET (ver backend/.env.example)");
  process.exit(1);
}

// En producción no se alteran las tablas automáticamente; en desarrollo sí
const syncOptions = process.env.NODE_ENV === "production" ? {} : { alter: true };

// Sincronización de la base de datos
sequelize
  .sync(syncOptions)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en puerto ${PORT} ✓`),
    );
  })
  .catch((error) => {
    console.error("Error al sincronizar las tablas:", error);
  });
