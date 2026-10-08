const request = require("supertest");

// Evita abrir una conexión real a MySQL: los modelos dependen de config/db
jest.mock("../config/db", () => ({
  define: jest.fn(() => ({})),
  transaction: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../models/Exercise", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

const User = require("../models/User");
const Exercise = require("../models/Exercise");
const app = require("../app");

const makeExercise = (overrides = {}) => ({
  id: 10,
  name: "Press banca",
  isPublic: true,
  creatorId: 1,
  update: jest.fn().mockResolvedValue(),
  destroy: jest.fn().mockResolvedValue(),
  ...overrides,
});

const regularUser = { id: 2, isAdmin: false };
const adminUser = { id: 1, isAdmin: true };
const body = { name: "Nuevo nombre", description: "desc", muscleGroup: "pecho" };

describe("Permisos de ejercicios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("PUT /api/exercise/:id", () => {
    it("responde 400 si falta userId", async () => {
      const res = await request(app).put("/api/exercise/10").send(body);

      expect(res.status).toBe(400);
      expect(Exercise.findByPk).not.toHaveBeenCalled();
    });

    it("responde 403 si un usuario común edita un ejercicio global", async () => {
      const exercise = makeExercise({ isPublic: true });
      Exercise.findByPk.mockResolvedValue(exercise);
      User.findByPk.mockResolvedValue(regularUser);

      const res = await request(app).put("/api/exercise/10").send({ ...body, userId: 2 });

      expect(res.status).toBe(403);
      expect(exercise.update).not.toHaveBeenCalled();
    });

    it("permite a un admin editar un ejercicio global", async () => {
      const exercise = makeExercise({ isPublic: true });
      Exercise.findByPk.mockResolvedValue(exercise);
      User.findByPk.mockResolvedValue(adminUser);

      const res = await request(app).put("/api/exercise/10").send({ ...body, userId: 1 });

      expect(res.status).toBe(200);
      expect(exercise.update).toHaveBeenCalledWith(body);
    });

    it("responde 403 si un usuario edita el ejercicio privado de otro", async () => {
      const exercise = makeExercise({ isPublic: false, creatorId: 99 });
      Exercise.findByPk.mockResolvedValue(exercise);
      User.findByPk.mockResolvedValue(regularUser);

      const res = await request(app).put("/api/exercise/10").send({ ...body, userId: 2 });

      expect(res.status).toBe(403);
      expect(exercise.update).not.toHaveBeenCalled();
    });

    it("permite al creador editar su ejercicio privado", async () => {
      const exercise = makeExercise({ isPublic: false, creatorId: 2 });
      Exercise.findByPk.mockResolvedValue(exercise);
      User.findByPk.mockResolvedValue(regularUser);

      const res = await request(app).put("/api/exercise/10").send({ ...body, userId: 2 });

      expect(res.status).toBe(200);
      expect(exercise.update).toHaveBeenCalledWith(body);
    });
  });

  describe("DELETE /api/exercise/:id", () => {
    it("responde 400 si falta userId", async () => {
      const res = await request(app).delete("/api/exercise/10");

      expect(res.status).toBe(400);
    });

    it("responde 403 si un usuario común elimina un ejercicio global", async () => {
      const exercise = makeExercise({ isPublic: true });
      Exercise.findByPk.mockResolvedValue(exercise);
      User.findByPk.mockResolvedValue(regularUser);

      const res = await request(app).delete("/api/exercise/10?userId=2");

      expect(res.status).toBe(403);
      expect(exercise.destroy).not.toHaveBeenCalled();
    });

    it("permite al creador eliminar su ejercicio privado", async () => {
      const exercise = makeExercise({ isPublic: false, creatorId: 2 });
      Exercise.findByPk.mockResolvedValue(exercise);
      User.findByPk.mockResolvedValue(regularUser);

      const res = await request(app).delete("/api/exercise/10?userId=2");

      expect(res.status).toBe(200);
      expect(exercise.destroy).toHaveBeenCalled();
    });
  });
});
