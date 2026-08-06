// models/ExerciseSet.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ExerciseSet = sequelize.define(
    "ExerciseSet",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        routineExerciseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        setNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reps: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weightKg: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true, // Ejercicio con peso corporal 
        },
    },
    {
        tableName: "ExerciseSet",
        timestamps: true,
    }
);

ExerciseSet.associate = (models) => {
    // Pertenece al ejercicio asignado en la rutina
    ExerciseSet.belongsTo(models.RoutineExercise, {
        foreignKey: "routineExerciseId",
    });
};

module.exports = ExerciseSet;