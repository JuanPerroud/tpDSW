const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

// Middleware central de errores: todas las respuestas de error tienen la forma { mensaje, errores? }
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ mensaje: err.message, errores: err.errores });
  }

  // JSON mal formado u otros errores del parser de Express
  if (err.status && err.status < 500 && err.expose) {
    return res.status(err.status).json({ mensaje: "La solicitud es inválida" });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ mensaje: "Ya existe un registro con esos datos" });
  }
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ mensaje: err.errors?.[0]?.message || "Datos inválidos" });
  }
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({ mensaje: "Referencia a un registro inexistente" });
  }

  if (process.env.NODE_ENV !== "test") {
    console.error("Error no controlado:", err);
  }
  return res.status(500).json({ mensaje: "Error interno del servidor" });
};

module.exports = { notFound, errorHandler };
