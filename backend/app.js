const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerSpec = require("./config/swagger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

// CORS_ORIGIN admite varios orígenes separados por coma; sin definir permite cualquiera (desarrollo)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Rutas
const mainRoutes = require("./routes/mainRoutes");
app.use("/", mainRoutes);

// Documentación de la API (OpenAPI / Swagger UI)
app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const routineRoutes = require("./routes/routineRoutes");
app.use("/api/routine", routineRoutes);

const exerciseRoutes = require("./routes/exerciseRoutes");
app.use("/api/exercise", exerciseRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;