# Tests automáticos

Resumen de la última ejecución (Windows, Node 24):

| Suite | Herramienta | Tests |
|---|---|:-:|
| Backend – unitarios | Jest + Supertest (modelos mockeados) | 
| Backend – integración | Jest + Supertest + SQLite en memoria | 
| Frontend – unitario de componente | Vitest + React Testing Library | 
| Frontend – end-to-end | Playwright (Chromium) | 

Además se verificó el flujo completo contra un **MySQL real** con los seeders (registro → login → comunidad con detalle desde el backend → guardar rutina → crear ejercicio → rutas de admin) y los códigos 401/403/404 de la API.

## Cómo ejecutarlos

```bash
# Backend
cd backend
npm test                  # todos
npm run test:unit         # solo unitarios
npm run test:integration  # solo integración

# Frontend
cd frontend
npm test                  # unitario de componente
npx playwright install chromium   # solo la primera vez
npm run test:e2e          # end-to-end (levanta el frontend solo; la API se simula)
```

No requieren MySQL: los unitarios mockean los modelos, la integración usa SQLite en memoria (`NODE_ENV=test`) y el E2E simula la API con `page.route`.

## Qué prueba cada test

### Backend

| Archivo | Tipo | Casos |
|---|---|---|
| `backend/tests/user.login.test.js` | Unitario | Login: usuario inexistente (404), cuenta desactivada (403), contraseña incorrecta (400), body inválido (400), login correcto con JWT y sin exponer la contraseña (200), migración de contraseñas viejas en texto plano a bcrypt |
| `backend/tests/exercise.permissions.test.js` | Unitario | Autenticación (sin token 401, token inválido 401, cuenta desactivada 403) y permisos de ejercicios: global solo admin, privado solo su creador, validación del body e ids, 404 |
| `backend/tests/integration/api.integration.test.js` | **Integración** | Flujo completo con la app real y la BD: registro (hash bcrypt, sin escalada de privilegios, duplicados), login, rutas protegidas por nivel (401/403), ejercicios globales y privados, creación de rutina con ejercicios y series, detalle ordenado con creador, permisos de dueño, desactivación de usuario (el token deja de funcionar) y borrado |

### Frontend

| Archivo | Tipo | Casos |
|---|---|---|
| `frontend/src/components/routines/RoutineCard/RoutineCard.test.jsx` | Unitario de componente | Render, detalle expandible que pide la rutina al backend (ejercicios ordenados, series, peso, creador), una sola request, error de red con mensaje amigable, acciones de rutina propia vs. comunidad, rutina vacía |
| `frontend/e2e/auth-routines.spec.js` | End-to-end | Redirección sin sesión, error de login, usuario común sin acceso a `/admin/users`, admin con gestión de usuarios, 401 que cierra la sesión, listado de rutinas, detalle desde el backend con JWT, comunidad y cierre de sesión |

