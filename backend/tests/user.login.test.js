const request = require("supertest");

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
const app = require("../app");

describe("POST /api/user/login", () => {
  const credentials = { email: "juan@test.com", password: "123456" };

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
    User.findOne.mockResolvedValue({ ...credentials, status: false });

    const res = await request(app).post("/api/user/login").send(credentials);

    expect(res.status).toBe(403);
    expect(res.body.mensaje).toMatch(/desactivada/i);
  });

  it("responde 400 si la contraseña es incorrecta", async () => {
    User.findOne.mockResolvedValue({ ...credentials, status: true });

    const res = await request(app)
      .post("/api/user/login")
      .send({ ...credentials, password: "incorrecta" });

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/incorrecta/i);
  });

  it("responde 200 y devuelve el usuario con credenciales correctas", async () => {
    const user = { id: 1, name: "Juan", ...credentials, status: true, isAdmin: false };
    User.findOne.mockResolvedValue(user);

    const res = await request(app).post("/api/user/login").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe("Inicio de sesión exitoso");
    expect(res.body.user).toMatchObject({ id: 1, email: credentials.email });
  });
});
