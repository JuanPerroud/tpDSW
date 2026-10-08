const { Sequelize } = require("sequelize");
require("dotenv").config();

// En tests se usa SQLite en memoria para no depender de un MySQL externo
const isTest = process.env.NODE_ENV === "test";

const sequelize = isTest
  ? new Sequelize({ dialect: "sqlite", storage: ":memory:", logging: false })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        logging: false,
        // Muchos MySQL gratuitos en la nube exigen SSL (DB_SSL=true)
        dialectOptions:
          process.env.DB_SSL === "true"
            ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
            : {},
      },
    );

if (!isTest) {
  sequelize
    .authenticate()
    .then(() => console.log("Conectado a MySQL con Sequelize ✓"))
    .catch((err) => console.error("Error al conectar con Sequelize:", err));
}

module.exports = sequelize;
