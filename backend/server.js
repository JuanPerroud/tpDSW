require("dotenv").config();

// Importamos todos los modelos desde ./models/index.js (registra las asociaciones)
const { sequelize } = require("./models");
const app = require("./app");

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
