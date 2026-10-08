const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;
const BCRYPT_REGEX = /^\$2[aby]\$/;

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

const isHashed = (value) => typeof value === "string" && BCRYPT_REGEX.test(value);

// Compatibilidad: usuarios viejos con contraseña en texto plano siguen pudiendo
// ingresar y se migran a hash en el primer login exitoso (needsRehash).
const verifyPassword = async (plain, stored) => {
  if (!plain || !stored) return { valid: false, needsRehash: false };
  if (isHashed(stored)) {
    return { valid: await bcrypt.compare(plain, stored), needsRehash: false };
  }
  return { valid: plain === stored, needsRehash: plain === stored };
};

module.exports = { hashPassword, verifyPassword, isHashed };
