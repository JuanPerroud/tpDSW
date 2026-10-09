/**
 * Test de integración: app Express real + Sequelize + SQLite en memoria.
 * Recorre el flujo completo: registro → login → ejercicios → rutina → permisos.
 */
const request = require("supertest");

// Carga los modelos y registra las asociaciones
const { sequelize, User } = require("../../models");
const app = require("../../app");
const { hashPassword } = require("../../utils/password");

const auth = (token) => ({ Authorization: `Bearer ${token}` });

const register = (data) =>
  request(app).post("/api/user").send({ surname: "Test", age: 25, password: "123456", ...data });

const login = async (email, password = "123456") => {
  const res = await request(app).post("/api/user/login").send({ email, password });
  return res;
};

describe("Integración: flujo completo de la API", () => {
  let adminToken;
  let ana; // { token, id }
  let beto;
  let publicExercise;
  let privateExercise;
  let routine;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.create({
      name: "Admin",
      surname: "Gym",
      age: 30,
      email: "admin@test.com",
      password: await hashPassword("admin123"),
      isAdmin: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Usuarios y autenticación", () => {
    it("registra un usuario común, guarda la contraseña hasheada y no la expone", async () => {
      const res = await register({ name: "Ana", email: "ana@test.com" });

      expect(res.status).toBe(201);
      expect(res.body.password).toBeUndefined();
      expect(res.body.isAdmin).toBe(false);

      const stored = await User.findOne({ where: { email: "ana@test.com" } });
      expect(stored.password).not.toBe("123456");
      expect(stored.password).toMatch(/^\$2[aby]\$/);
    });

    it("no permite escalar privilegios enviando isAdmin en el registro", async () => {
      const res = await register({ name: "Hacker", email: "hacker@test.com", isAdmin: true });

      expect(res.status).toBe(201);
      expect(res.body.isAdmin).toBe(false);
    });

    it("rechaza un email repetido y datos inválidos", async () => {
      const dup = await register({ name: "Ana 2", email: "ana@test.com" });
      expect(dup.status).toBe(400);

      const invalid = await register({ name: "X", email: "no-es-mail", password: "1" });
      expect(invalid.status).toBe(400);
      expect(invalid.body.errores.length).toBeGreaterThan(0);
    });

    it("inicia sesión con credenciales válidas y rechaza las incorrectas", async () => {
      await register({ name: "Beto", email: "beto@test.com" });

      const adminRes = await login("admin@test.com", "admin123");
      const anaRes = await login("ana@test.com");
      const betoRes = await login("beto@test.com");

      expect(anaRes.status).toBe(200);
      expect(anaRes.body.token).toEqual(expect.any(String));
      expect(anaRes.body.user.password).toBeUndefined();
      expect((await login("ana@test.com", "mala")).status).toBe(400);
      expect((await login("noexiste@test.com")).status).toBe(404);

      adminToken = adminRes.body.token;
      ana = { token: anaRes.body.token, id: anaRes.body.user.id };
      beto = { token: betoRes.body.token, id: betoRes.body.user.id };
    });

    it("protege las rutas: sin token 401 y un usuario común no accede a rutas de admin (403)", async () => {
      expect((await request(app).get("/api/routine")).status).toBe(401);
      expect((await request(app).get("/api/user").set(auth(ana.token))).status).toBe(403);

      const list = await request(app).get("/api/user").set(auth(adminToken));
      expect(list.status).toBe(200);
      expect(list.body.length).toBeGreaterThanOrEqual(3);
      list.body.forEach((u) => expect(u.password).toBeUndefined());
    });
  });

  describe("Ejercicios", () => {
    it("el admin crea un ejercicio global y el usuario uno privado", async () => {
      const global = await request(app)
        .post("/api/exercise")
        .set(auth(adminToken))
        .send({ name: "Press banca", muscleGroup: "pecho" });
      const privado = await request(app)
        .post("/api/exercise")
        .set(auth(ana.token))
        .send({ name: "Mi ejercicio", description: "Solo mío", muscleGroup: "espalda" });

      expect(global.status).toBe(201);
      expect(global.body.isPublic).toBe(true);
      expect(privado.status).toBe(201);
      expect(privado.body).toMatchObject({ isPublic: false, creatorId: ana.id });

      publicExercise = global.body;
      privateExercise = privado.body;
    });

    it("cada usuario ve los globales y solo sus privados", async () => {
      const anaList = await request(app).get("/api/exercise").set(auth(ana.token));
      const betoList = await request(app).get("/api/exercise").set(auth(beto.token));

      expect(anaList.body.map((e) => e.id).sort()).toEqual([publicExercise.id, privateExercise.id].sort());
      expect(betoList.body.map((e) => e.id)).toEqual([publicExercise.id]);
    });

    it("valida el grupo muscular y respeta los permisos de edición", async () => {
      const invalid = await request(app)
        .post("/api/exercise")
        .set(auth(ana.token))
        .send({ name: "Raro", muscleGroup: "inexistente" });
      expect(invalid.status).toBe(400);

      const body = { name: "Editado", muscleGroup: "pecho" };
      expect((await request(app).put(`/api/exercise/${publicExercise.id}`).set(auth(ana.token)).send(body)).status).toBe(403);
      expect((await request(app).put(`/api/exercise/${privateExercise.id}`).set(auth(beto.token)).send(body)).status).toBe(403);
      expect((await request(app).put(`/api/exercise/${privateExercise.id}`).set(auth(ana.token)).send(body)).status).toBe(200);
    });
  });

  describe("Rutinas", () => {
    it("crea una rutina con ejercicios y series; el dueño es el usuario autenticado", async () => {
      const res = await request(app)
        .post("/api/routine")
        .set(auth(ana.token))
        .send({
          name: "Torso",
          description: "Fuerza",
          creatorId: 9999, // se ignora: el dueño sale del token
          RoutineExercises: [
            {
              exerciseId: publicExercise.id,
              orderIndex: 2,
              restSeconds: 60,
              ExerciseSets: [{ setNumber: 1, reps: 10, weightKg: 60 }, { setNumber: 2, reps: 8, weightKg: 65 }],
            },
            {
              exerciseId: privateExercise.id,
              orderIndex: 1,
              ExerciseSets: [{ setNumber: 1, reps: 12, weightKg: null }],
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.creatorId).toBe(ana.id);
      routine = res.body;
    });

    it("el detalle devuelve rutina + ejercicios ordenados + series + creador", async () => {
      const res = await request(app).get(`/api/routine/${routine.id}`).set(auth(beto.token));

      expect(res.status).toBe(200);
      expect(res.body.creator).toMatchObject({ id: ana.id, name: "Ana" });
      expect(res.body.creator.password).toBeUndefined();
      expect(res.body.RoutineExercises.map((re) => re.Exercise.name)).toEqual(["Editado", "Press banca"]);
      expect(res.body.RoutineExercises[1].ExerciseSets).toHaveLength(2);
      expect(res.body.RoutineExercises[1].restSeconds).toBe(60);
    });

    it("valida el body y los ids", async () => {
      const noName = await request(app).post("/api/routine").set(auth(ana.token)).send({ description: "x" });
      expect(noName.status).toBe(400);

      const badId = await request(app).get("/api/routine/abc").set(auth(ana.token));
      expect(badId.status).toBe(400);

      const missing = await request(app).get("/api/routine/99999").set(auth(ana.token));
      expect(missing.status).toBe(404);
    });

    it("solo el dueño (o un admin) puede editar o eliminar la rutina", async () => {
      const update = { name: "Torso v2", RoutineExercises: [{ exerciseId: publicExercise.id, ExerciseSets: [{ setNumber: 1, reps: 5 }] }] };

      expect((await request(app).put(`/api/routine/${routine.id}`).set(auth(beto.token)).send(update)).status).toBe(403);
      expect((await request(app).delete(`/api/routine/${routine.id}`).set(auth(beto.token))).status).toBe(403);

      expect((await request(app).put(`/api/routine/${routine.id}`).set(auth(ana.token)).send(update)).status).toBe(200);
      const after = await request(app).get(`/api/routine/${routine.id}`).set(auth(ana.token));
      expect(after.body.name).toBe("Torso v2");
      expect(after.body.RoutineExercises).toHaveLength(1);
    });

    it("el admin desactiva a un usuario y su token deja de funcionar", async () => {
      const toggle = await request(app).patch(`/api/user/${beto.id}/toggle-active`).set(auth(adminToken));
      expect(toggle.status).toBe(200);
      expect(toggle.body.user.status).toBe(false);

      expect((await request(app).get("/api/routine").set(auth(beto.token))).status).toBe(403);
      expect((await login("beto@test.com")).status).toBe(403);
    });

    it("elimina la rutina y la deja de listar", async () => {
      expect((await request(app).delete(`/api/routine/${routine.id}`).set(auth(ana.token))).status).toBe(200);

      const list = await request(app).get("/api/routine").set(auth(ana.token));
      expect(list.body.find((r) => r.id === routine.id)).toBeUndefined();
    });
  });
});
