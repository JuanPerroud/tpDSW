import { test, expect } from "@playwright/test";

const API = "http://localhost:3000/api";
const TOKEN = "jwt-de-prueba";

const user = { id: 5, name: "Juan", surname: "Perroud", email: "juan@test.com", isAdmin: false, status: true };
const admin = { id: 1, name: "Admin", surname: "Gym", email: "admin@test.com", isAdmin: true, status: true };

const pressBanca = {
  exerciseId: 1,
  orderIndex: 1,
  restSeconds: 90,
  Exercise: { id: 1, name: "Press banca", muscleGroup: "pecho" },
  ExerciseSets: [{ setNumber: 1, reps: 10, weightKg: 60 }],
};

const routines = [
  { id: 1, name: "Rutina de pecho", description: "Fuerza e hipertrofia", creatorId: 5, RoutineExercises: [pressBanca] },
  { id: 2, name: "Rutina de otro usuario", description: "Rutina pública", creatorId: 99, RoutineExercises: [] },
];

const usersList = [
  { id: 7, name: "Lucía", email: "lucia@test.com", isAdmin: false, status: true },
  { id: 8, name: "Marcos", email: "marcos@test.com", isAdmin: false, status: false },
];

// Simula el backend para que el test no dependa de MySQL ni del servidor Express.
// Como el backend real, exige el JWT en las rutas protegidas.
async function mockApi(page, { loggedUser = user, requests = [] } = {}) {
  const protectedRoute = (handler) => async (route) => {
    requests.push({ url: route.request().url(), auth: route.request().headers().authorization });
    if (route.request().headers().authorization !== `Bearer ${TOKEN}`) {
      return route.fulfill({ status: 401, json: { mensaje: "Debés iniciar sesión" } });
    }
    return handler(route);
  };

  await page.route(`${API}/user/login`, async (route) => {
    const { password } = route.request().postDataJSON();
    if (password === "123456") {
      await route.fulfill({ json: { mensaje: "Inicio de sesión exitoso", user: loggedUser, token: TOKEN } });
    } else {
      await route.fulfill({ status: 400, json: { mensaje: "Contraseña incorrecta" } });
    }
  });
  await page.route(`${API}/routine`, protectedRoute((route) => route.fulfill({ json: routines })));
  await page.route(`${API}/routine/1`, protectedRoute((route) =>
    route.fulfill({ json: { ...routines[0], creator: { id: 5, name: "Juan", surname: "Perroud" } } }),
  ));
  await page.route(`${API}/exercise`, protectedRoute((route) => route.fulfill({ json: [] })));
  await page.route(`${API}/user`, protectedRoute((route) => route.fulfill({ json: usersList })));
}

async function login(page, password, email = "juan@test.com") {
  await page.goto("/");
  await page.getByLabel("Correo Electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();
}

test.describe("Autenticación y rutas protegidas", () => {
  test("un usuario no autenticado es redirigido al login", async ({ page }) => {
    await mockApi(page);
    await page.goto("/routines");

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Bienvenido a GymRoutines" })).toBeVisible();
  });

  test("muestra el error del servidor con contraseña incorrecta", async ({ page }) => {
    await mockApi(page);
    await login(page, "equivocada");

    await expect(page.getByRole("alert")).toContainText("Contraseña incorrecta");
    await expect(page).toHaveURL("/");
  });

  test("un usuario común no accede a la sección de administración y no ve el enlace", async ({ page }) => {
    await mockApi(page);
    await login(page, "123456");
    await expect(page).toHaveURL(/\/routines$/);
    await expect(page.getByRole("link", { name: /Usuarios/ })).toHaveCount(0);

    await page.goto("/admin/users");

    await expect(page).toHaveURL(/\/routines$/);
  });

  test("un administrador accede a la gestión de usuarios", async ({ page }) => {
    await mockApi(page, { loggedUser: admin });
    await login(page, "123456", "admin@test.com");

    await page.getByRole("link", { name: /Usuarios/ }).click();

    await expect(page).toHaveURL(/\/admin\/users$/);
    await expect(page.getByText("Lucía", { exact: true })).toBeVisible();
    await expect(page.getByText("Marcos", { exact: true })).toBeVisible();
    await expect(page.getByText("Inactivo", { exact: true })).toBeVisible();
  });

  test("si el token deja de ser válido (401) se cierra la sesión", async ({ page }) => {
    await mockApi(page);
    await login(page, "123456");
    await expect(page.getByRole("heading", { name: "Rutina de pecho" })).toBeVisible();

    await page.evaluate(() => localStorage.setItem("token", "token-vencido"));
    await page.getByRole("link", { name: /Ejercicios/ }).click();

    await expect(page).toHaveURL("/");
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  });
});

test.describe("Rutinas", () => {
  test("login correcto: lista mis rutinas, pide el detalle al backend y muestra la comunidad", async ({ page }) => {
    const requests = [];
    await mockApi(page, { requests });
    await login(page, "123456");

    await expect(page).toHaveURL(/\/routines$/);
    await expect(page.getByRole("heading", { name: "Rutina de pecho" })).toBeVisible();
    // Solo aparecen las rutinas propias (la del otro usuario es de la comunidad)
    await expect(page.getByText("Rutina de otro usuario")).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBe(TOKEN);

    await page.getByRole("button", { name: /Ver detalle/ }).click();
    await expect(page.getByText("Creada por Juan Perroud")).toBeVisible();
    await expect(page.getByText("Press banca")).toBeVisible();
    await expect(page.getByText("10 reps")).toBeVisible();
    await expect(page.getByText("@ 60 kg")).toBeVisible();

    // Todas las requests protegidas viajaron con el JWT
    expect(requests.some((r) => r.url.endsWith("/routine/1"))).toBe(true);
    expect(requests.every((r) => r.auth === `Bearer ${TOKEN}`)).toBe(true);

    await page.getByRole("link", { name: /Comunidad/ }).click();
    await expect(page).toHaveURL(/\/community-routines$/);
    await expect(page.getByRole("heading", { name: "Rutina de otro usuario" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Guardar en Mis Rutinas/ })).toBeVisible();
  });

  test("cerrar sesión limpia el token y vuelve al login", async ({ page }) => {
    await mockApi(page);
    await login(page, "123456");
    await expect(page).toHaveURL(/\/routines$/);

    await page.getByRole("button", { name: "Cerrar sesión" }).click();

    await expect(page).toHaveURL("/");
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
    await page.goto("/routines");
    await expect(page).toHaveURL("/");
  });
});
