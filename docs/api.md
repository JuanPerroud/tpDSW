# Documentación de la API

La documentación interactiva (OpenAPI 3 / Swagger UI) se sirve desde el propio backend:

- **Swagger UI**: `http://localhost:3000/api/docs`
- **Especificación JSON**: `http://localhost:3000/api/docs.json`

Se genera a partir de los comentarios `@openapi` de `backend/routes/*.js` y los esquemas de `backend/config/swagger.js`.

## Convenciones

- Base URL: `/api`. Formato: JSON.
- **Autenticación**: `Authorization: Bearer <token>` (el token se obtiene en `POST /api/user/login`).
- **Errores**: `{ "mensaje": "texto", "errores": ["detalle1", "..."] }`

| Código | Significado |
|---|---|
| 400 | Datos inválidos (validación) o regla de negocio |
| 401 | Falta el token o es inválido/expirado |
| 403 | Sin permisos (nivel de acceso, cuenta desactivada o recurso ajeno) |
| 404 | Recurso inexistente |
| 409 | Registro duplicado |
| 500 | Error interno |

## Endpoints

### Usuarios — `/api/user`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/login` | Público | Inicia sesión → `{ mensaje, user, token }` |
| POST | `/` | Público | Registra un usuario común |
| GET | `/?search=` | Admin | Lista usuarios (filtra por nombre o email) |
| GET | `/:id` | Admin o el propio usuario | Obtiene un usuario |
| PUT | `/:id` | Admin o el propio usuario | Actualiza nombre, apellido, edad y/o contraseña |
| PUT | `/change-password` | Usuario | Cambia la contraseña propia |
| PATCH | `/:id/toggle-active` | Admin | Activa o desactiva un usuario (no admins) |
| DELETE | `/:id` | Admin | Elimina un usuario (no admins) |

### Ejercicios — `/api/exercise` (requiere sesión)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Usuario | Ejercicios globales + los privados del usuario |
| GET | `/:id` | Usuario | Detalle (los privados, solo su creador o un admin) |
| POST | `/` | Usuario | Crea un ejercicio: **global** si lo crea un admin, **privado** si no |
| PUT | `/:id` | Global: admin · Privado: creador | Edita |
| DELETE | `/:id` | Global: admin · Privado: creador | Elimina |

Cuerpo de `POST`/`PUT`: `{ name (≤100), description?, muscleGroup }` con `muscleGroup` ∈ `cuadriceps, isquiotibiales, gluteos, gemelos, pecho, espalda, hombros, biceps, triceps, abdomen, cardio`.

### Rutinas — `/api/routine` (requiere sesión)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Usuario | Todas las rutinas (propias y de la comunidad) con ejercicios y series |
| GET | `/:id` | Usuario | **Detalle**: rutina + ejercicios (con su definición) + series + creador |
| POST | `/` | Usuario | Crea una rutina; el dueño es el usuario del token |
| PUT | `/:id` | Dueño o admin | Actualiza y reemplaza ejercicios/series (transacción) |
| DELETE | `/:id` | Dueño o admin | Elimina la rutina |

Ejemplo de cuerpo de `POST /api/routine`:

```json
{
  "name": "Pecho y tríceps",
  "description": "Fuerza e hipertrofia",
  "RoutineExercises": [
    {
      "exerciseId": 1,
      "orderIndex": 1,
      "restSeconds": 90,
      "ExerciseSets": [
        { "setNumber": 1, "reps": 10, "weightKg": 60 },
        { "setNumber": 2, "reps": 8, "weightKg": 65 }
      ]
    }
  ]
}
```

### IA — `/api/ai`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/generate` | Usuario | `{ prompt }` → `{ generatedRoutine }` (Markdown generado con Gemini) |
