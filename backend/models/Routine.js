const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Routine = sequelize.define(
  "Routine",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    muscularGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exercises: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "Routine",
    timestamps: true,
  },
);

// creatorId es la FK que referencia al User que creó la rutina
Routine.belongsTo(User, { foreignKey: { name: "creatorId", allowNull: true }, onDelete: "CASCADE" });

module.exports = Routine;
