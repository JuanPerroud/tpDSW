# Deploy gratuito

| Parte | Servicio | Por qué |
|---|---|---|
| Base de datos MySQL | **Aiven** |
| Backend (Express) | **Render** (Web Service Free) | 
| Frontend (React + Vite) | **Vercel** (Hobby) | Build estático desde GitHub; `frontend/vercel.json` resuelve las rutas de la SPA. |



## 1. Base de datos (Aiven)

1. Crear un servicio **MySQL** con el plan *Free* en <https://aiven.io>.
2. Copiar **Host, Port, User, Password** y el nombre de la base (`defaultdb`) desde *Connection information*.
3. Aiven exige SSL: en el backend se activa con `DB_SSL=true`.
4. Cargar los datos de prueba **una vez**, desde tu máquina (las tablas las crea el backend al arrancar la primera vez, ver paso 2):

   ```powershell
   cd backend
   $env:DB_HOST="..."; $env:DB_PORT="..."; $env:DB_USER="..."; $env:DB_PASSWORD="..."; $env:DB_NAME="defaultdb"; $env:DB_SSL="true"
   node -e "require('./models').sequelize.sync()"
   npx sequelize-cli db:seed:all --env production
   ```

## 2. Backend (Render)

1. En <https://render.com> → *New* → **Blueprint** y elegir el repositorio (usa `render.yaml` de la raíz). También se puede crear un *Web Service* manual con:
   - Build command: `npm install --workspace=backend`
   - Start command: `npm start --workspace=backend`
2. Cargar las variables de entorno (ver `backend/.env.example`):
   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`, `JWT_SECRET` (Render lo genera), `CORS_ORIGIN` (URL del frontend en Vercel, sin `/` final) y, opcional, `GEMINI_API_KEY`.
3. Con `NODE_ENV=production` el backend ejecuta `sequelize.sync()` sin `alter`: crea las tablas si no existen en el primer arranque.
4. Verificar: `https://<tu-servicio>.onrender.com/` responde el saludo y `/api/docs` muestra la documentación Swagger.

## 3. Frontend (Vercel)

1. En <https://vercel.com> → *Add New Project* → importar el repositorio.
2. *Root Directory*: `frontend`. Framework: Vite (se detecta solo).
3. Variable de entorno: `VITE_API_URL=https://<tu-servicio>.onrender.com/api`
4. Deploy. Volver a Render y actualizar `CORS_ORIGIN` con la URL final de Vercel.

## 4. Datos para la entrega

Completar cuando el deploy esté listo:

| Dato | Valor |
|---|---|
| URL del frontend | _(completar)_ |
| URL del backend / Swagger | _(completar)_ `/api/docs` |
| Usuario administrador | `admin@gymroutines.com` / `adminpassword123` |
| Usuario común | `carlos.gomez@example.com` / `password123` |

