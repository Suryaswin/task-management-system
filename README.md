# Task Management System

A full-stack multi-user task manager with a Spring Boot backend and a mind-blowing React frontend.

## Structure
- `task-system/`: Backend (Spring Boot, JWT, MySQL)
- `task-frontend/`: Frontend (React, neon-glow UI)

## Features
- User signup/login with JWT
- CRUD operations for tasks (per user)
- Task filtering by priority, pagination (5/page), 5s polling
- Futuristic neon UI with animations

## Setup
### Backend
1. Install Java 21, MySQL 8.0.
2. Update `task-system/src/main/resources/application.properties` with MySQL credentials.
3. Run:
   ```bash
   cd task-system
   .\mvnw spring-boot:run

### Frontend
1. Install Node.js 16.20.2.
2. Run:
        cd task-frontend
        npm install
        npm start

Tech Stack
Backend: Spring Boot, JPA, MySQL, JWT, Maven
Frontend: React, react-router-dom v6, CSS