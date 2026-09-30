'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ExerciseSet', [
      // Sets para RoutineExercise 1 (Press de Banca)
      {
        id: 1,
        routineExerciseId: 1,
        setNumber: 1,
        reps: 10,
        weightKg: 60.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        routineExerciseId: 1,
        setNumber: 2,
        reps: 8,
        weightKg: 70.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        routineExerciseId: 1,
        setNumber: 3,
        reps: 6,
        weightKg: 80.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sets para RoutineExercise 2 (Remo con Barra)
      {
        id: 4,
        routineExerciseId: 2,
        setNumber: 1,
        reps: 10,
        weightKg: 50.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        routineExerciseId: 2,
        setNumber: 2,
        reps: 10,
        weightKg: 55.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sets para RoutineExercise 3 (Press Militar)
      {
        id: 6,
        routineExerciseId: 3,
        setNumber: 1,
        reps: 8,
        weightKg: 40.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        routineExerciseId: 3,
        setNumber: 2,
        reps: 8,
        weightKg: 40.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sets para RoutineExercise 4 (Sentadilla Trasera)
      {
        id: 8,
        routineExerciseId: 4,
        setNumber: 1,
        reps: 10,
        weightKg: 80.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        routineExerciseId: 4,
        setNumber: 2,
        reps: 8,
        weightKg: 90.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        routineExerciseId: 4,
        setNumber: 3,
        reps: 6,
        weightKg: 100.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sets para RoutineExercise 5 (Peso Muerto Rumano)
      {
        id: 11,
        routineExerciseId: 5,
        setNumber: 1,
        reps: 10,
        weightKg: 70.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        routineExerciseId: 5,
        setNumber: 2,
        reps: 10,
        weightKg: 75.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ExerciseSet', null, {});
  }
};
