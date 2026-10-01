# Employee Management System

A full-stack Employee Management System built using Spring Boot, React.js, MySQL and Docker.

## Technology Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Lombok

### Frontend
- React.js
- Vite
- Axios
- Bootstrap
- React Router
- Nginx

### DevOps
- Docker
- Git
- GitHub

## Features

- JWT Authentication
- ADMIN and EMPLOYEE roles
- Employee Management
- Department Management
- Employee Search
- Pagination
- Validation
- Global Exception Handling
- Role-Based Access Control
- 401 / 403 / 400 Error Handling
- Unit Testing with JUnit and Mockito
- Dockerized Backend
- Dockerized Frontend
- Nginx SPA Routing

## Project Structure

```text
employee-management-system/
│
├── ems-backend/
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .gitignore
│
├── ems-frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── .gitignore
└── README.md
```
Backend
```
Run Without Docker
cd ems-backend
mvn spring-boot:run
```
Backend:
```
http://localhost:8082
Backend API

Authentication:

POST /api/auth/login

Employee:

/api/employees

Department:

/api/departments
```
Frontend
Run Without Docker
cd ems-frontend
npm install
npm run dev

Frontend:
```
http://localhost:5173
```
Docker Setup
```
The application can also be run using Docker.

Backend Docker

Backend Docker image uses Java 21 JRE.

Build the image:

cd ems-backend
docker build -t ems-backend:1.0 .

Run the backend container:

docker run -d --name ems-backend-container --env-file .env -p 8082:8082 ems-backend:1.0

Backend:

http://localhost:8082
Frontend Docker

The React application is built and served using Nginx.

Build the image:

cd ems-frontend
docker build -t ems-frontend:1.1 .

Run the frontend container:

docker run -d --name ems-frontend -p 3000:80 ems-frontend:1.1
```
Frontend:
```
http://localhost:3000
Docker Architecture
                 Browser
                    │
                    ▼
          React + Nginx Container
             localhost:3000
                    │
                    │ REST API
                    ▼
          Spring Boot Container
             localhost:8082
                    │
                    │ JPA / Hibernate
                    ▼
              MySQL Database
             localhost:3306
Docker Containers
ems-frontend
    Host: 3000
    Container: 80

ems-backend-container
    Host: 8082
    Container: 8082
MySQL Configuration

The backend connects to MySQL using:

Host: host.docker.internal
Port: 3306
Database: ems_db
```
When running the backend inside Docker, host.docker.internal is used to access MySQL running on the host machine.

Environment Variables
Backend

The following environment variables are required:
```
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD

Database configuration:

DB_URL
DB_USERNAME
DB_PASSWORD
Frontend
VITE_API_URL

Example:

VITE_API_URL=http://localhost:8082/api
```
Do not commit .env files or sensitive credentials to GitHub.

Authentication

The application uses JWT-based authentication.

Login request:
```
POST /api/auth/login

After successful login:

User
  ↓
AuthenticationManager
  ↓
UserRepository
  ↓
JWT Token
  ↓
React Local Storage
  ↓
Protected API Requests
```
The JWT token is sent with protected requests using the Authorization header:

Authorization: Bearer <token>
Error Handling

The application handles:

400 Bad Request
401 Unauthorized
403 Forbidden
Validation errors
Global exceptions
Testing

Run backend tests:

cd ems-backend
mvn test
Development URLs
Local Development
```
Frontend:

http://localhost:5173

Backend:

http://localhost:8082
Docker

Frontend:

http://localhost:3000

Backend:

http://localhost:8082
Screenshot

GitHub

Repository:

https://github.com/mrmanishgit/employee-management-system
```
## Run with Docker

Open CMD in the project folder:

```bash
cd "C:\Users\ajitm\OneDrive\Desktop\COMPANY PROJECT"
docker compose up -d
docker compose ps
```
http://localhost:3000
```
If you changed Java/React/Docker files

cd "C:\Users\ajitm\OneDrive\Desktop\COMPANY PROJECT"
docker compose up -d --build
```


Stop Application
```
docker compose down
Project Structure
employee-management-system/
├── ems-backend/
├── ems-frontend/
├── docker-compose.yml
├── .env.example
└── README.md
```
Current project status
```
Step 1   Backend CRUD                    ✅
Step 2   JWT Authentication              ✅
Step 3   React Frontend                  ✅
Step 4   Validation/Exceptions           ✅
Step 5   Role + 401/403/400              ✅
Step 6   Pagination/Search               ✅
Step 7   Swagger                         ⏭️ Skipped
Step 8   JUnit + Mockito                 ✅ 22/22
Step 9   GitHub                          ✅
Step 10  Docker                          ✅
Step 11  Docker Compose                  🔄 NOW
Step 12  Jenkins CI/CD                   ⏳
Step 13  Deployment                      ⏳
```

<img width="1672" height="941" alt="dash" src="https://github.com/user-attachments/assets/86e8c8de-0976-415a-beeb-31176a2967d9" />
