# GymRoutines - Sistema de Gestión de Rutinas

Aplicación web Full-Stack para la creación, personalización y seguimiento de rutinas de entrenamiento, ejercicios y recomendaciones asistidas por IA.

📚 **Documentación completa:** [docs/](docs/README.md) · **API (Swagger):** `http://localhost:3000/api/docs` con el backend corriendo.

---

## 🛠️ Stack Tecnológico

### Backend
* **Entorno de ejecución:** [Node.js](https://nodejs.org/)
* **Framework:** [Express 5](https://expressjs.com/)
* **ORM:** [Sequelize](https://sequelize.org/) y [Sequelize CLI](https://github.com/sequelize/cli)
* **Base de Datos:** [MySQL](https://www.mysql.com/) (driver `mysql2`)
* **Autenticación:** JWT (`jsonwebtoken`) y contraseñas con `bcryptjs`; dos niveles de acceso (usuario / admin)
* **Validación:** [Yup](https://github.com/jquense/yup)
* **Documentación de la API:** OpenAPI / Swagger UI
* **Inteligencia Artificial:** [Google Generative AI](https://www.npmjs.com/package/@google/generative-ai) (Gemini API)
* **Tests:** Jest + Supertest
* **Utilidades:** `dotenv`, `cors`, `nodemon`

### Frontend
* **Biblioteca UI:** [React 19](https://react.dev/)
* **Bundler & Dev Server:** [Vite](https://vitejs.dev/)
* **Enrutamiento:** [React Router 7](https://reactrouter.com/)
* **Gestión y Validación de Formularios:** [Formik](https://formik.org/) y [Yup](https://github.com/jquense/yup)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Estilos:** [Bootstrap 5](https://getbootstrap.com/) + CSS por componente (mobile-first)
* **Tests:** Vitest + React Testing Library (unitarios) y Playwright (end-to-end)

---

## 📋 Requisitos Previos

* **Node.js** (versión 18 o superior recomendada).
* **MySQL Server** en ejecución local.

---

## ⚙️ Instrucciones de Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd gymroutines
```

---

### 2. Configurar y Levantar el Backend

1. Entrar en la carpeta `backend` e instalar dependencias:
   ```bash
   cd backend
   npm install
   ```

2. Configurar las variables de entorno:
   - Duplicar el archivo `.env.example` y renombrarlo a `.env`.
   - Completar las credenciales de tu base de datos local, el secreto de JWT y la clave de Gemini (opcional para IA):
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=tu_usuario_mysql
     DB_PASSWORD=tu_contraseña_mysql
     DB_NAME=gymroutines
     JWT_SECRET=un_secreto_largo_y_aleatorio
     CORS_ORIGIN=http://localhost:5173
     GEMINI_API_KEY=tu_api_key_de_gemini
     ```
   - Para generar un `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

3. Crear la base de datos en MySQL:
   - Acceder a tu cliente MySQL (MySQL Workbench, phpMyAdmin o terminal) y ejecutar:
     ```sql
     CREATE DATABASE gymroutines;
     ```

4. Generar las tablas automáticamente:
   - Iniciar el servidor por primera vez:
     ```bash
     npm run dev
     ```
   - Al observar el mensaje de confirmación (`Servidor corriendo en puerto 3000 ✓`), detener el proceso con `Ctrl + C`. Sequelize habrá creado todas las tablas y relaciones.

5. Poblar la base de datos con los seeders de prueba:
   ```bash
   npm run seed
   ```

6. Iniciar el backend definitivamente:
   ```bash
   npm run dev
   ```

> El servidor arranca desde `backend/server.js`; `backend/app.js` solo exporta la app de Express (la usan los tests).

**Usuarios de prueba (seeders):**

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@gymroutines.com` | `adminpassword123` |
| Usuario | `carlos.gomez@example.com` | `password123` |
| Usuario | `lucia.fernandez@example.com` | `password123` |

---

### 3. Configurar y Levantar el Frontend

En una **nueva terminal**:

1. Navegar a la carpeta `frontend` e instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. (Opcional) Configurar la URL del backend. Por defecto usa `http://localhost:3000/api`. Para cambiarla, copiar `.env.example` a `.env` y editar:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. Iniciar la aplicación web:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador la URL indicada por Vite (habitualmente `http://localhost:5173`).

---

## 🧪 Tests automáticos

No requieren MySQL. Detalle y evidencia de la última ejecución en [docs/tests.md](docs/tests.md).

**Backend** (Jest + Supertest):
```bash
cd backend
npm test                  # todos
npm run test:unit         # unitarios (modelos mockeados)
npm run test:integration  # integración (app real + SQLite en memoria)
```

**Frontend**:
```bash
cd frontend
npm test                          # test unitario de componente (Vitest)
npx playwright install chromium   # solo la primera vez
npm run test:e2e                  # end-to-end (Playwright; levanta el frontend y simula la API)
```

---

## 🚀 Deploy

Guía de deploy gratuito (Aiven MySQL + Render + Vercel) en [docs/deploy.md](docs/deploy.md).

* **Frontend:** _(completar con la URL de Vercel)_
* **Backend / Swagger:** _(completar con la URL de Render)_ `/api/docs`
