// Error controlado de la API: el middleware de errores lo convierte en una respuesta JSON
class ApiError extends Error {
  constructor(status, mensaje, errores) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
    this.errores = errores;
  }
}

module.exports = ApiError;
