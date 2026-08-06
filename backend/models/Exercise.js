// models/Exercise.js
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
  },
  {
    tableName: "Exercise",
    timestamps: true,
  }
);

Exercise.associate = (models) => {
  // Un ejercicio puede estar asignado en muchas rutinas a través de RoutineExercise
  Exercise.hasMany(models.RoutineExercise, {
    foreignKey: "exerciseId",
    onDelete: "CASCADE",
  });
};

module.exports = Exercise;