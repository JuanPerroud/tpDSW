import { test, expect } from "@playwright/test";

const API = "http://localhost:3000/api";

const user = {
  id: 5,
  name: "Juan",
  surname: "Perroud",
  email: "juan@test.com",
  isAdmin: false,
  status: true,
};

const routines = [
  {
    id: 1,
    name: "Rutina de pecho",
    description: "Fuerza e hipertrofia",
    creatorId: 5,
    RoutineExercises: [
      {
        exerciseId: 1,
        orderIndex: 1,
        restSeconds: 90,
        Exercise: { id: 1, name: "Press banca", muscleGroup: "pecho" },
        ExerciseSets: [{ setNumber: 1, reps: 10, weightKg: 60 }],
      },
    ],
  },
  {
    id: 2,
    name: "Rutina de otro usuario",
    description: "Rutina pública",
    creatorId: 99,
    RoutineExercises: [],
  },
];

// Simula el backend para que el test no dependa de MySQL ni del servidor Express
async function mockApi(page) {
  await page.route(`${API}/user/login`, async (route) => {
    const { password } = route.request().postDataJSON();
    if (password === "123456") {
      await route.fulfill({ json: { mensaje: "Inicio de sesión exitoso", user } });
    } else {
      await route.fulfill({ status: 400, json: { mensaje: "Contraseña incorrecta" } });
    }
  });
  await page.route(`${API}/routine`, (route) => route.fulfill({ json: routines }));
  await page.route(`${API}/exercise**`, (route) => route.fulfill({ json: [] }));
}

async function login(page, password) {
  await page.goto("/");
  await page.getByLabel("Correo Electrónico").fill("juan@test.com");
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();
}

test.describe("Flujo de autenticación y rutinas", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test("un usuario no autenticado es redirigido al login", async ({ page }) => {
    await page.goto("/routines");

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Bienvenido a GymRoutines" })).toBeVisible();
  });

  test("muestra el error del servidor con contraseña incorrecta", async ({ page }) => {
    await login(page, "equivocada");

    await expect(page.getByRole("alert")).toContainText("Contraseña incorrecta");
    await expect(page).toHaveURL("/");
  });

  test("login correcto: muestra mis rutinas, el detalle y la pestaña de comunidad", async ({ page }) => {
    await login(page, "123456");

    await expect(page).toHaveURL(/\/routines$/);
    await expect(page.getByRole("heading", { name: "Rutina de pecho" })).toBeVisible();
    // Solo aparecen las rutinas propias (la del otro usuario es de la comunidad)
    await expect(page.getByText("Rutina de otro usuario")).toHaveCount(0);

    await page.getByRole("button", { name: /Ver detalle/ }).click();
    await expect(page.getByText("Press banca")).toBeVisible();
    await expect(page.getByText("10 reps")).toBeVisible();
    await expect(page.getByText("@ 60 kg")).toBeVisible();

    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("user")).id)).toBe(5);

    await page.getByRole("link", { name: /Comunidad/ }).click();
    await expect(page).toHaveURL(/\/community-routines$/);
    await expect(page.getByRole("heading", { name: "Rutina de otro usuario" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Guardar en Mis Rutinas/ })).toBeVisible();
  });
});
