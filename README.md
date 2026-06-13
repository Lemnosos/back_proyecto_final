# Proyecto Final Backend

API REST del proyecto final del bootcamp. Backend para un juego de combates por turnos con sistema de personajes, enemigos, historial de peleas y autenticación JWT con control de roles (admin/user).

---

## Tecnologías

- **Runtime:** Node.js 18+ con ES Modules (`"type": "module"`)
- **Framework:** Express
- **Base de datos:** PostgreSQL (Docker)
- **Autenticación:** JWT (jsonwebtoken) + bcryptjs
- **Validaciones:** express-validator
- **Logs:** Morgan
- **Tests:** Vitest + Supertest
- **Documentación:** Swagger UI + OpenAPI 3.0 (YAML)

---

## Requisitos previos

- Node.js 18 o superior
- Docker Desktop instalado y en ejecución
- Puerto **5432** libre (PostgreSQL)
- Puerto **3000** libre (Express)

---

## Instalación y configuración

```bash
# 1. Clonar el repositorio
git clone <git remote add origin https://github.com/Lemnosos/back_proyecto_final.git>
cd Proyecto_final_back

# 2. Instalar dependencias
npm i

# 3. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env si es necesario (los valores por defecto funcionan con Docker local)

# 4. Iniciar PostgreSQL con Docker
docker run --name some-postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres:16

# 5. Crear la base de datos
docker exec -it some-postgres psql -U postgres -c "CREATE DATABASE proyecto_final;"

# 6. Poblar la base de datos con datos de ejemplo
npm run seed

# 7. Iniciar el servidor
npm run dev
```

El servidor arranca en `http://localhost:3000`.

---

## Variables de entorno

| Variable        | Descripción                   | Valor por defecto                                    |
| --------------- | ----------------------------- | ---------------------------------------------------- |
| `PORT`          | Puerto del servidor Express   | `3000`                                               |
| `URL_BASE`      | Prefijo de la API             | `/api/v1`                                            |
| `SQL_USER`      | Usuario de PostgreSQL         | `postgres`                                           |
| `SQL_HOST`      | Host de PostgreSQL            | `localhost`                                          |
| `SQL_PASS`      | Contraseña de PostgreSQL      | `123456`                                             |
| `SQL_PORT`      | Puerto de PostgreSQL          | `5432`                                               |
| `SQL_DB`        | Nombre de la base de datos    | `proyecto_final`                                     |
| `BCRYPTJSC_INT` | Salt rounds para bcrypt       | `10`                                                 |
| `SECRET_KEY`    | Clave secreta para firmar JWT | Generar con `crypto.randomBytes(64).toString('hex')` |
| `CORS_ORIGIN`   | Origen permitido para CORS    | `http://localhost:5173`                              |

---

## Estructura del proyecto

```
src/
├── app.js                     # Configuración Express, middlewares, rutas
├── controllers/               # Lógica de cada endpoint
│   ├── auth.controllers.js    #   Registro, login, renovar token
│   ├── admin.controller.js    #   CRUD enemigos/usuarios, historial, nuevoAdmin
│   └── user.controller.js     #   CRUD personaje, perfil, historial, combate
├── routes/                    # Definición de rutas con validaciones
│   ├── auth.routes.js
│   ├── admin.routes.js
│   └── user.routes.js
├── models/                    # Acceso a base de datos (SQL directo)
│   ├── user.model.js
│   ├── personaje.model.js
│   ├── enemigo.model.js
│   └── combate.model.js
├── middlewares/               # Middlewares Express
│   ├── validateTokens.js      #   JWT + auto-refresh via x-token
│   ├── validarRol.js          #   Guard de roles (...roles)
│   └── validateImputs.js      #   Errores de express-validator
├── utils/                     # Funciones auxiliares
│   ├── sqlConect.js           #   Pool compartido de PostgreSQL
│   ├── queries.js             #   Consultas SQL + buildUpdateQuery()
│   ├── gestionarTokens.js     #   Generar y verificar JWT
│   └── gestionarContraseñas.js #   Hash y comparación con bcrypt
├── db/
│   ├── init.sql               #   Esquema de tablas
│   └── seed.js                #   Datos de ejemplo
├── docs/
│   ├── openapi.yaml           #   Especificación OpenAPI 3.0
│   └── swagger.js             #   Carga y sirve Swagger UI
└── tests/                     # Tests de integración
    ├── setup.js               #   Helpers (getToken, crearUsuario, limpiar)
    ├── auth.test.js           #   6 tests
    ├── admin.test.js          #   13 tests
    └── user.test.js           #   8 tests
```

---

## Endpoints de la API

### Auth (`/api/v1/public`)
| Método | Ruta            | Descripción             | Auth |
| ------ | --------------- | ----------------------- | ---- |
| POST   | `/public/new`   | Registrar nuevo usuario | No   |
| POST   | `/public`       | Iniciar sesión          | No   |
| GET    | `/public/renew` | Renovar token           | JWT  |

### Admin (`/api/v1/admin`)
| Método | Ruta                  | Descripción                            |
| ------ | --------------------- | -------------------------------------- |
| GET    | `/admin/enemigos`     | Listar enemigos (usa `?id=X` para uno) |
| POST   | `/admin/enemigos`     | Crear enemigo                          |
| PATCH  | `/admin/enemigos`     | Actualizar enemigo                     |
| DELETE | `/admin/enemigos`     | Eliminar enemigo                       |
| GET    | `/admin/usuarios`     | Listar usuarios                        |
| GET    | `/admin/usuarios/:id` | Obtener usuario por ID                 |
| PATCH  | `/admin/usuarios/:id` | Actualizar usuario                     |
| DELETE | `/admin/usuarios/:id` | Eliminar usuario                       |
| GET    | `/admin/historial`    | Historial completo de peleas           |
| POST   | `/admin/nuevoAdmin`   | Crear nuevo administrador              |

### User (`/api/v1/users`)
| Método | Ruta                  | Descripción                     |
| ------ | --------------------- | ------------------------------- |
| GET    | `/users/Personaje`    | Obtener mi personaje            |
| PUT    | `/users/Personaje`    | Crear personaje (1 por usuario) |
| PATCH  | `/users/Personaje`    | Actualizar personaje            |
| DELETE | `/users/Personaje`    | Eliminar personaje              |
| GET    | `/users/usuarios`     | Obtener mis datos               |
| PATCH  | `/users/usuarios/:id` | Actualizar mis datos            |
| DELETE | `/users/usuarios/:id` | Eliminar mi cuenta              |
| GET    | `/users/historial`    | Historial de mis combates       |
| PUT    | `/users/historial`    | Guardar resultado de combate    |
| GET    | `/users/enemigo`      | Enemigo aleatorio               |

### Health
| Método | Ruta             | Descripción  |
| ------ | ---------------- | ------------ |
| GET    | `/api/v1/health` | Health check |

---

## Autenticación

- **Registro:** `POST /api/v1/public/new` → devuelve un JWT.
- **Login:** `POST /api/v1/public` → devuelve un JWT válido por 1 hora.
- **Uso:** Enviar el token en el header `Authorization: Bearer <token>`.
- **Auto-refresh:** Cada respuesta de un endpoint autenticado incluye un nuevo token en el header `x-token`. El frontend debe recogerlo y reemplazar el token actual.
- **Roles:** `admin` (gestión completa) y `user` (solo sus propios datos). Controlado por middleware `validarRol()`.

### Usuarios de prueba (seed)

| Email              | Contraseña      | Rol   |
| ------------------ | --------------- | ----- |
| `admin@test.com`   | `Admin1234`     | admin |
| `jugador@test.com` | `Jugador1234`   | user  |
| `pro@test.com`     | `ProPlayer1234` | user  |

---

## Tests

```bash
npm test
```

Ejecuta Vitest con Supertest contra la base de datos real (PostgreSQL debe estar corriendo).

- `auth.test.js` — 6 tests (registro, login, renew)
- `admin.test.js` — 13 tests (CRUD enemigos, usuarios, permisos)
- `user.test.js` — 8 tests (personaje, perfil, historial, enemigo)
- **Total:** 27 tests

---

## Documentación interactiva (Swagger)

La documentación OpenAPI 3.0 está disponible en:

```
http://localhost:3000/
```

Incluye todos los endpoints, esquemas de datos, códigos de respuesta y el esquema de seguridad JWT. Es la fuente de verdad para el frontend.
