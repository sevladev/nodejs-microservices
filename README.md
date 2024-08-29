# Microservices Project

This project consists of multiple microservices that work together to provide a modular and scalable application. Each microservice has its own responsibilities and is built using different technologies.

## Project Structure

### 1. Users Micro-Service

- Technologies: Express, TypeScript, MongoDB
- Directory: /users

Responsibilities:

- User Creation: Handles the creation of new users in the system, storing data in MongoDB.
- JWT Generation: Generates JSON Web Tokens (JWT) for user authentication and authorization.
- Token Refresh: Manages the lifecycle of JWTs, allowing secure token renewal when necessary.

Main Endpoints:

- POST /users: Creates a new user.
- POST /users/auth: Authenticates a user and returns a JWT.
- POST /users/refresh-token: Refreshes an expired JWT.

---

### 2. Places Micro-Service

- Technologies: NestJS, TypeScript, PostgreSQL
- Directory: /places

Responsibilities:

- Places Creation: Manages the creation and storage of "places" in the PostgreSQL database.

Main Endpoints:

- POST /places: Create a new "place".

---

## Folder Structure

- /users: Contains the source code and configuration for the Users microservice.
- /places: Contains the source code and configuration for the Places microservice.

---

## Setup and Execution

### Requirements

- Docker and Docker Compose
- Node.js (if you want to run the services locally without Docker)
- PostgreSQL (if you want to run the database locally without Docker)

### Steps to Run with Docker

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sevladev/nodejs-microservices
   cd nodejs-microservices
   ```
2. **Configure Environment Variables**
   ```bash
   docker-compose up --build
   ```
