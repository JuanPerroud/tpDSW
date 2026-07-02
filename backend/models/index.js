const sequelize = require("../config/db");

const User = require("./User");
const Routine = require("./Routine");
const Exercise = require("./Exercise");

const models = {
  User,
  Routine,
  Exercise,
};

// Ejecuta las asociaciones de cada modelo que las tenga definidas
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
