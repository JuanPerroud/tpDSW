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
const { signToken } = require("../utils/token");
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

const regularUser = { id: 2, isAdmin: false, status: true };
const adminUser = { id: 1, isAdmin: true, status: true };
const body = { name: "Nuevo nombre", description: "desc", muscleGroup: "pecho" };

// Simula una sesión: el middleware valida el JWT y busca al usuario en la BD (mockeada)
const as = (user) => {
  User.findByPk.mockResolvedValue(user);
  return { Authorization: `Bearer ${signToken(user)}` };
};

describe("Permisos de ejercicios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Autenticación", () => {
    it("responde 401 si no hay token", async () => {
      const res = await request(app).put("/api/exercise/10").send(body);

      expect(res.status).toBe(401);
      expect(Exercise.findByPk).not.toHaveBeenCalled();
    });

    it("responde 401 si el token es inválido", async () => {
      const res = await request(app)
        .delete("/api/exercise/10")
        .set("Authorization", "Bearer token-falso");

      expect(res.status).toBe(401);
    });

    it("responde 403 si la cuenta del token fue desactivada", async () => {
      const headers = as({ ...regularUser, status: false });

      const res = await request(app).delete("/api/exercise/10").set(headers);

      expect(res.status).toBe(403);
    });
  });

  describe("PUT /api/exercise/:id", () => {
    it("responde 400 si el body no es válido", async () => {
      const headers = as(adminUser);

      const res = await request(app)
        .put("/api/exercise/10")
        .set(headers)
        .send({ name: "", muscleGroup: "inexistente" });

      expect(res.status).toBe(400);
      expect(Exercise.findByPk).not.toHaveBeenCalled();
    });

    it("responde 403 si un usuario común edita un ejercicio global", async () => {
      const exercise = makeExercise({ isPublic: true });
      Exercise.findByPk.mockResolvedValue(exercise);

      const res = await request(app).put("/api/exercise/10").set(as(regularUser)).send(body);

      expect(res.status).toBe(403);
      expect(exercise.update).not.toHaveBeenCalled();
    });

    it("permite a un admin editar un ejercicio global", async () => {
      const exercise = makeExercise({ isPublic: true });
      Exercise.findByPk.mockResolvedValue(exercise);

      const res = await request(app).put("/api/exercise/10").set(as(adminUser)).send(body);

      expect(res.status).toBe(200);
      expect(exercise.update).toHaveBeenCalledWith(body);
    });

    it("responde 403 si un usuario edita el ejercicio privado de otro", async () => {
      const exercise = makeExercise({ isPublic: false, creatorId: 99 });
      Exercise.findByPk.mockResolvedValue(exercise);

      const res = await request(app).put("/api/exercise/10").set(as(regularUser)).send(body);

      expect(res.status).toBe(403);
      expect(exercise.update).not.toHaveBeenCalled();
    });

    it("permite al creador editar su ejercicio privado", async () => {
      const exercise = makeExercise({ isPublic: false, creatorId: 2 });
      Exercise.findByPk.mockResolvedValue(exercise);

      const res = await request(app).put("/api/exercise/10").set(as(regularUser)).send(body);

      expect(res.status).toBe(200);
      expect(exercise.update).toHaveBeenCalledWith(body);
    });

    it("responde 404 si el ejercicio no existe", async () => {
      Exercise.findByPk.mockResolvedValue(null);

      const res = await request(app).put("/api/exercise/10").set(as(adminUser)).send(body);

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/exercise/:id", () => {
    it("responde 400 si el id no es numérico", async () => {
      const res = await request(app).delete("/api/exercise/abc").set(as(adminUser));

      expect(res.status).toBe(400);
    });

    it("responde 403 si un usuario común elimina un ejercicio global", async () => {
      const exercise = makeExercise({ isPublic: true });
      Exercise.findByPk.mockResolvedValue(exercise);

      const res = await request(app).delete("/api/exercise/10").set(as(regularUser));

      expect(res.status).toBe(403);
      expect(exercise.destroy).not.toHaveBeenCalled();
    });

    it("permite al creador eliminar su ejercicio privado", async () => {
      const exercise = makeExercise({ isPublic: false, creatorId: 2 });
      Exercise.findByPk.mockResolvedValue(exercise);

      const res = await request(app).delete("/api/exercise/10").set(as(regularUser));

      expect(res.status).toBe(200);
      expect(exercise.destroy).toHaveBeenCalled();
    });
  });
});
