// models/RoutineExercise.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RoutineExercise = sequelize.define(
    "RoutineExercise",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        routineId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exerciseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        restSeconds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 90,
        },
    },
    {
        tableName: "RoutineExercise",
        timestamps: true,
    }
);

RoutineExercise.associate = (models) => {
    // Pertenece a una Rutina
    RoutineExercise.belongsTo(models.Routine, {
        foreignKey: "routineId",
    });

    // Pertenece a un Ejercicio del catálogo
    RoutineExercise.belongsTo(models.Exercise, {
        foreignKey: "exerciseId",
    });

    // Tiene muchas series configuradas (ExerciseSet)
    RoutineExercise.hasMany(models.ExerciseSet, {
        foreignKey: "routineExerciseId",
        onDelete: "CASCADE",
    });
};

module.exports = RoutineExercise;