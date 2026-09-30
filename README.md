# Employee Management System

A full-stack Employee Management System built using Spring Boot, React.js and MySQL.

## Technology Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React.js
- Vite
- Axios
- Bootstrap
- React Router

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

## Project Structure

```text
employee-management-system/
├── ems-backend/
└── ems-frontend/

Backend

Run:

cd ems-backend
mvn spring-boot:run

Backend:

http://localhost:8080
Frontend

Run:

cd ems-frontend
npm install
npm run dev

Frontend:

http://localhost:5173
Testing

Run backend tests:

cd ems-backend
mvn test
Environment Variables

Backend environment variables:

DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD

Frontend:

VITE_API_URL
