# Flow Desk - Task Management API

This project implements the FSD intern assignment requirements on top of your existing schema using Spring Boot + PostgreSQL + JWT.

## Step-by-step implementation map

1. Domain schema
- Added `User` role support and uniqueness constraints.
- Added `Task` and `TaskDocument` entities with relationships.

2. Security
- JWT login/registration.
- BCrypt password hashing.
- Role-based authorization (`ADMIN`, `USER`).

3. Core APIs
- User CRUD (`ADMIN` manages all users, user can access/update self).
- Task CRUD with ownership checks.
- Task filtering/sorting/pagination via Spring pageable parameters.

4. Document handling
- Upload PDF files to local storage.
- Maximum 3 PDF files per task.
- Download/view and delete document endpoints.

5. DevOps and quality
- Integration tests with H2.
- Swagger UI enabled.
- Docker + Docker Compose support.

## Run locally

### Prerequisites
- Java 17
- Maven 3.9+
- PostgreSQL

### Start app

```bash
./mvnw spring-boot:run
```

Default env vars (can be overridden):
- `DB_URL=jdbc:postgresql://localhost:5433/flowdesk`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `JWT_SECRET=<base64-secret>`
- `STORAGE_PATH=uploads`

This app also supports loading variables from a project `.env` file (see `src/main/resources/application.properties`).

Swagger UI:
- `http://localhost:8080/swagger-ui/index.html`

## Run with Docker

### Prerequisites
- Docker Desktop (or Docker Engine + Compose plugin)

### 1. Prepare environment
Create a `.env` file from `.env.example` and set at least:
- `POSTGRES_PASSWORD`
- `DB_PASSWORD` (keep it same as `POSTGRES_PASSWORD`)
- `JWT_SECRET` (base64-encoded secret)

You can keep other defaults as-is.

### 2. Start all services

```bash
docker compose up --build -d
```

This starts:
- PostgreSQL on `localhost:5433`
- Spring Boot backend on `localhost:8080`
- Frontend on `localhost:3000`

### 3. Open the app
- Frontend: `http://localhost:3000`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### 4. Stop services

```bash
docker compose down
```

To also remove DB/upload volumes:

```bash
docker compose down -v
```

## Production DB (Neon)

For production, set backend env vars like:

- `DB_URL=jdbc:postgresql://<neon-host>/<db>?sslmode=require&channelBinding=require`
- `DB_USERNAME=<neon-user>`
- `DB_PASSWORD=<neon-password>`
- `APP_CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>`

Keep `SPRING_JPA_HIBERNATE_DDL_AUTO=update` (or change to `validate` once schema is stable).

## Key endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/users`
- `GET/POST/PUT/DELETE /api/tasks`
- `POST /api/tasks/{id}/documents`
- `GET /api/tasks/documents/{documentId}`
- `DELETE /api/tasks/{taskId}/documents/{documentId}`

## Filtering, sorting, pagination

Example:

`GET /api/tasks?status=TODO&priority=HIGH&dueDateFrom=2026-04-01&page=0&size=10&sort=dueDate,asc`

## Test

```bash
./mvnw test
```

## Frontend on Vercel

If you deploy the React app to Vercel:

- Set **Root Directory** to `frontend`
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Add env var: `VITE_API_BASE_URL=https://<your-backend-host>`

The SPA rewrite is configured in `frontend/vercel.json` so routes like `/tasks/123` open correctly.

If you deployed from repo root by mistake, this repo now includes a root `vercel.json` that builds `frontend` and serves `frontend/dist`.

### If `*.vercel.app` shows `ERR_CONNECTION_TIMED_OUT`

1. In Vercel project settings, verify Root Directory is `frontend` (or use repo-root deploy with root `vercel.json`), build command resolves to Vite frontend build, and production deployment status is **Ready** (not Canceled/Errored).
2. Redeploy and open the latest production URL from Vercel dashboard.
3. Confirm `VITE_API_BASE_URL` is set in Vercel environment variables.
4. Deploy backend separately (Render/Railway/Fly.io/VM). This Spring Boot backend is not meant to run as a long-running process on Vercel.
