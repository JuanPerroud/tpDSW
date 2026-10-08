// Variables de entorno para los tests (se ejecuta antes de cada archivo de test)
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "secreto-de-tests";
process.env.JWT_EXPIRES_IN = "1h";
