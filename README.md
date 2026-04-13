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
- `DB_URL=jdbc:postgresql://localhost:5432/flowdesk`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `JWT_SECRET=<base64-secret>`
- `STORAGE_PATH=uploads`

Swagger UI:
- `http://localhost:8080/swagger-ui/index.html`

## Run with Docker

```bash
docker-compose up --build
```

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
