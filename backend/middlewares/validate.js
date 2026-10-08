const ApiError = require("../utils/ApiError");

// Valida y normaliza req.body con un esquema Yup; descarta campos no declarados
const validateBody = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body ?? {}, {
      abortEarly: false,
      stripUnknown: true,
    });
    next();
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new ApiError(400, err.errors[0], err.errors);
    }
    throw err;
  }
};

// Valida que el parámetro :id sea un entero positivo
const validateId = (req, res, next, value) => {
  if (!/^\d+$/.test(value) || Number(value) < 1) {
    throw new ApiError(400, "El id debe ser un número entero positivo");
  }
  next();
};

module.exports = { validateBody, validateId };
