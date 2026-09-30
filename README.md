# GymRoutines - Sistema de Gestión de Rutinas

Aplicación web Full-Stack para la creación, personalización y seguimiento de rutinas de entrenamiento, ejercicios y recomendaciones asistidas por IA.

---

## 🛠️ Stack Tecnológico

### Backend
* **Entorno de ejecución:** [Node.js](https://nodejs.org/)
* **Framework:** [Express 5](https://expressjs.com/)
* **ORM:** [Sequelize](https://sequelize.org/) y [Sequelize CLI](https://github.com/sequelize/cli)
* **Base de Datos:** [MySQL](https://www.mysql.com/) (driver `mysql2`)
* **Inteligencia Artificial:** [Google Generative AI](https://www.npmjs.com/package/@google/generative-ai) (Gemini API)
* **Utilidades:** `dotenv`, `cors`, `nodemon`

### Frontend
* **Biblioteca UI:** [React 19](https://react.dev/)
* **Bundler & Dev Server:** [Vite](https://vitejs.dev/)
* **Enrutamiento:** [React Router 7](https://reactrouter.com/)
* **Gestión y Validación de Formularios:** [Formik](https://formik.org/) y [Yup](https://github.com/jquense/yup)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Estilos:** CSS Modular / [Bootstrap 5](https://getbootstrap.com/)

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
   - Completar las credenciales de tu base de datos local y clave de Gemini (opcional para IA):
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_USER=tu_usuario_mysql
     DB_PASSWORD=tu_contraseña_mysql
     DB_NAME=gymroutines
     GEMINI_API_KEY=tu_api_key_de_gemini
     ```

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
   npx sequelize-cli db:seed:all
   ```

6. Iniciar el backend definitivamente:
   ```bash
   npm run dev
   ```

---

### 3. Configurar y Levantar el Frontend

En una **nueva terminal**:

1. Navegar a la carpeta `frontend` e instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Iniciar la aplicación web:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador la URL indicada por Vite (habitualmente `http://localhost:5173`).



