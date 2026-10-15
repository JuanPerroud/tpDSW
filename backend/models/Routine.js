// models/Routine.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
    muscleGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Routine",
    timestamps: true,
  }
);

Routine.associate = (models) => {
  // 1. Relación con el Usuario creador
  Routine.belongsTo(models.User, {
    foreignKey: "creatorId",
    as: "creator",
    onDelete: "CASCADE",
  });

  // 2. Relación con los ejercicios asignados a esta rutina
  Routine.hasMany(models.RoutineExercise, {
    foreignKey: "routineId",
    onDelete: "CASCADE",
  });
};

module.exports = Routine;