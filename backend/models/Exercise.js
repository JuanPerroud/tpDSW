const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Exercise = sequelize.define(
  "Exercise",
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
    muscleGroup: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "muscleGroup",
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 3,
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10,
    },
  },
  {
    tableName: "Exercise",
    timestamps: true,
  },
);

module.exports = Exercise;
