const request = require("supertest");
const bcrypt = require("bcryptjs");

// Evita abrir una conexión real a MySQL: los modelos dependen de config/db
jest.mock("../config/db", () => ({
  define: jest.fn(() => ({})),
  transaction: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
}));

const User = require("../models/User");
const { verifyToken } = require("../utils/token");
const app = require("../app");

describe("POST /api/user/login", () => {
  const credentials = { email: "juan@test.com", password: "123456" };
  const hash = bcrypt.hashSync(credentials.password, 4);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("responde 404 si el usuario no existe", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/api/user/login").send(credentials);

    expect(res.status).toBe(404);
    expect(res.body.mensaje).toBe("El usuario no existe");
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: credentials.email } });
  });

  it("responde 403 si la cuenta está desactivada", async () => {
    User.findOne.mockResolvedValue({ ...credentials, password: hash, status: false });

    const res = await request(app).post("/api/user/login").send(credentials);

    expect(res.status).toBe(403);
    expect(res.body.mensaje).toMatch(/desactivada/i);
  });

  it("responde 400 si la contraseña es incorrecta", async () => {
    User.findOne.mockResolvedValue({ ...credentials, password: hash, status: true });

    const res = await request(app)
      .post("/api/user/login")
      .send({ ...credentials, password: "incorrecta" });

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/incorrecta/i);
    expect(res.body.token).toBeUndefined();
  });

  it("responde 400 si el body no cumple la validación", async () => {
    const res = await request(app).post("/api/user/login").send({ email: "no-es-un-mail" });

    expect(res.status).toBe(400);
    expect(res.body.errores.length).toBeGreaterThan(0);
    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("responde 200 con un JWT válido y sin exponer la contraseña", async () => {
    const user = { id: 1, name: "Juan", email: credentials.email, password: hash, status: true, isAdmin: false };
    User.findOne.mockResolvedValue(user);

    const res = await request(app).post("/api/user/login").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe("Inicio de sesión exitoso");
    expect(res.body.user).toMatchObject({ id: 1, email: credentials.email });
    expect(res.body.user.password).toBeUndefined();
    expect(verifyToken(res.body.token)).toMatchObject({ id: 1, isAdmin: false });
  });

  it("migra a hash una contraseña vieja guardada en texto plano", async () => {
    const update = jest.fn().mockResolvedValue();
    User.findOne.mockResolvedValue({
      id: 2, email: credentials.email, password: credentials.password, status: true, isAdmin: false, update,
    });

    const res = await request(app).post("/api/user/login").send(credentials);

    expect(res.status).toBe(200);
    const [{ password: newHash }] = update.mock.calls[0];
    expect(bcrypt.compareSync(credentials.password, newHash)).toBe(true);
  });
});
