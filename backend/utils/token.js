const jwt = require("jsonwebtoken");

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Falta la variable de entorno JWT_SECRET");
  }
  return secret;
};

const signToken = (user) =>
  jwt.sign({ id: user.id, isAdmin: Boolean(user.isAdmin) }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });

const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { signToken, verifyToken };
