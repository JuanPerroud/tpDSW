'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoutineExercise', [
      // Routine 1 (Torso)
      {
        id: 1,
        routineId: 1,
        exerciseId: 1, // Press de Banca Plano
        orderIndex: 1,
        restSeconds: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        routineId: 1,
        exerciseId: 3, // Remo con Barra
        orderIndex: 2,
        restSeconds: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        routineId: 1,
        exerciseId: 4, // Press Militar
        orderIndex: 3,
        restSeconds: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Routine 2 (Pierna)
      {
        id: 4,
        routineId: 2,
        exerciseId: 2, // Sentadilla Trasera
        orderIndex: 1,
        restSeconds: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        routineId: 2,
        exerciseId: 5, // Peso Muerto Rumano
        orderIndex: 2,
        restSeconds: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoutineExercise', null, {});
  }
};
