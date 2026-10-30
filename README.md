# MVP Evaluación Psicolaboral | AquaChile

Aplicación web para gestionar candidatos, solicitudes y evaluaciones psicolaborales del área de Reclutamiento y Selección de AquaChile. Proyecto VcM de la asignatura DSY1104 Desarrollo Full Stack II, Duoc UC.

> Todos los datos de la aplicación son ficticios.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite, React Router 6, Bootstrap 5 + Bootstrap Icons |
| Backend | Node.js + Express 5 (monolítico: entrega la API y el frontend compilado) |
| Base de datos | PostgreSQL en Supabase |
| Autenticación | JWT + contraseñas encriptadas con bcrypt |
| Pruebas | Vitest + Testing Library + Supertest |

## Cómo ejecutarlo

Requiere Node.js 20 o superior.

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` como `.env` y completar `DATABASE_URL` con la cadena de conexión de Supabase
   (Project Settings → Database → Connection string → *Session pooler*).

3. Crear las tablas y cargar los datos de prueba (borra lo que exista):

   ```bash
   npm run db:init
   ```

4. Levantar backend y frontend al mismo tiempo:

   ```bash
   npm run dev
   ```

   Abrir http://localhost:5173. La API queda en http://localhost:3001.

## Usuarios de prueba

Todos usan la contraseña `Aqua2026`.

| Usuario | Rol |
|---|---|
| paula.herrera@demo.cl | Analista de reclutamiento |
| rodrigo.lagos@demo.cl | Analista de reclutamiento |
| camila.rojas@demo.cl | Profesional evaluador |
| diego.munoz@demo.cl | Profesional evaluador |
| fernanda.soto@demo.cl | Profesional evaluador |

El formulario público (`/postular`) no requiere sesión.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Backend (puerto 3001) y frontend (puerto 5173) |
| `npm run db:init` | Crea las tablas y carga los datos de prueba |
| `npm test` | Ejecuta las pruebas con Vitest |
| `npm run coverage` | Pruebas con reporte de cobertura |
| `npm run build` | Compila el frontend en `dist/` |
| `npm start` | Servidor de producción (API + frontend compilado) |

## Estructura

```
server/
├── index.js               Arranca el servidor
├── app.js                 Configuración de Express y rutas
├── db.js                  Conexión a PostgreSQL (Supabase)
├── middleware/auth.js     Verificación del token y de roles
├── routes/                Endpoints de la API
└── db/                    Script SQL y datos de prueba
src/
├── App.jsx                Rutas de la aplicación
├── services/api.js        Llamadas al backend
├── context/               Sesión (AuthContext) y datos (DataContext)
├── data/catalogos.js      Etapas, familias de cargo, resultados, etc.
├── utils/                 Validaciones y cálculos (compartidos con el backend)
├── components/            layout, common, dashboard, candidatos, solicitudes
├── pages/                 Una vista por ruta
└── styles/global.css
```

## API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Inicia sesión y entrega el token |
| GET | `/api/candidatos` | Lista de candidatos |
| GET / POST / PUT | `/api/candidatos/:id` | Consultar, crear y editar candidatos |
| GET / POST | `/api/solicitudes` | Lista y creación de solicitudes |
| GET / PUT | `/api/solicitudes/:id` | Detalle; asignar responsable y fecha de entrevista |
| PATCH | `/api/solicitudes/:id/etapa` | Cambiar la etapa (con reglas del proceso) |
| PUT | `/api/solicitudes/:id/evaluacion` | Registrar la evaluación (solo evaluador) |
| GET | `/api/solicitudes/evaluaciones` | Lista de evaluaciones |
| GET | `/api/usuarios/evaluadores` | Evaluadores para asignar |
| POST | `/api/postulaciones` | Formulario público (sin sesión) |

Todas las rutas, excepto login y postulaciones, requieren el header `Authorization: Bearer <token>`.

## Documentación

- `docs/AVANCE.md`: problema, solución, modelo de datos y decisiones técnicas.
- `docs/PRUEBAS.md`: evidencia y justificación de las pruebas con Vitest.
