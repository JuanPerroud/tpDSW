// Devuelve el usuario sin la contraseña (nunca debe viajar al cliente)
const sanitizeUser = (user) => {
  if (!user) return user;
  const plain = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  delete plain.password;
  return plain;
};

module.exports = sanitizeUser;
