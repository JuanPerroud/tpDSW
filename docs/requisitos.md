

## Backend

| Requisito | Estado | Evidencia |
|---|:-:|---|
| JavaScript + framework web | ✅ | Node + Express 5 |
| API web REST | ✅ | [api.md](api.md) y Swagger en `/api/docs` |
| BD persistente externa + ORM | ✅ | MySQL con Sequelize |
| Desarrollo por capas | ✅ | rutas → middlewares → controladores → servicios → modelos ([arquitectura.md](arquitectura.md)) |
| Validar entrada y manejar errores | ✅ | `validators/` (Yup) + `middlewares/errorHandler.js`; respuestas `{ mensaje, errores }` |
| Dependencias registradas | ✅ | `backend/package.json` |
| 1 test automatizado por integrante | ✅ | 2 integrantes → `user.login.test.js` y `exercise.permissions.test.js` ([tests.md](tests.md)) |
| 1 test de integración | ✅ | `tests/integration/api.integration.test.js` (BD real, sin mocks) |
| Login con ≥2 niveles de acceso | ✅ | JWT; niveles usuario y admin |
| Proteger rutas según nivel | ✅ | `authenticate` + `requireAdmin` + reglas de dueño en los servicios |
| Ambientes (`.env`) | ✅ | `backend/.env.example`, `NODE_ENV` (test usa SQLite en memoria) |

## Frontend

| Requisito | Estado | Evidencia |
|---|:-:|---|
| Framework + HTML5 | ✅ | React 19 + Vite |
| CSS con framework / guía | ✅ | Bootstrap 5 + CSS por componente |
| Mobile-first | ✅ | Todos los `@media` son `min-width` |
| Visualización en SM / MD / LG | ✅ | Breakpoints 576 / 768 / 992 px |
| Eventos, errores amigables, reactividad, input/output | ✅ | Formik/Yup, mensajes de error de la API, `useState`/`useEffect`, props y callbacks (`onSave`, `onDelete`, ...) |
| Al menos un servicio | ✅ | `frontend/src/services/` (Axios + un servicio por recurso) |
| Modelos con clases | ✅ | `frontend/src/models/index.js` (JavaScript, sin TypeScript) |
| Patrón de diseño | ✅ | Custom hooks, capa de servicios (facade) y factory `fromApi` |
| Dependencias registradas | ✅ | `frontend/package.json` |
| 1 test unitario de componente | ✅ | `RoutineCard.test.jsx` |
| 1 test end-to-end | ✅ | `e2e/auth-routines.spec.js` |
| Login y protección por nivel | ✅ | Rutas protegidas en `App.jsx`; `/admin/users` solo admin; 401 cierra la sesión |
| Ambientes | ✅ | `VITE_API_URL` (`frontend/.env.example`) |

## Funcionales (grupo de 2 integrantes)

| Requisito | Estado | Detalle |
|---|:-:|---|
| 1 CRUD simple por integrante (2) | ✅ | Usuario, Ejercicio |
| 1 CRUD dependiente cada 2 (1) | ✅ | Rutina (depende de Usuario y Ejercicio) |
| 1 listado con filtro cada 2 (1) | ✅ | Ejercicios y rutinas de la comunidad, filtrados por grupo muscular |
| Detalle al seleccionar un elemento | ✅ | `GET /api/routine/:id` al expandir una rutina: rutina + ejercicios + series + creador |
| 1 caso de uso cada 2 (1) | ✅ | Armar una rutina |
| AD: CRUDs de todas las clases | ✅ | Usuario, Ejercicio, Rutina (con ejercicios y series) |
| AD: 1 caso de uso por integrante, ≥2 relacionados | ✅ | Armar rutina → Guardar rutina de la comunidad (+ gestionar usuarios, sugerir con IA) |

## Entrega y documentación

| Requisito | Estado | Dónde |
|---|:-:|---|
| README con instalación y ejecución | ✅ | [README principal](../README.md) |
| Carpeta `docs/` linkeada desde el README | ✅ | Este directorio |
| Proposal actualizada | 🟡 | [proposal.md](proposal.md) — completar legajos y links a los PR |
| Documentación de la API | ✅ | [api.md](api.md) + Swagger |
| Evidencia de tests automáticos | ✅ | [tests.md](tests.md) |
| Deploy, links y credenciales | 🟡 | Configuración y pasos en [deploy.md](deploy.md); falta crear las cuentas y ejecutar el deploy |
| Video explicando el sistema | 🟡 | Grabarlo y linkearlo en el README |
| Formulario de entrega y contacto | 🟡 | <https://kutt.to/DSWEntregaSistemaFinal> |
