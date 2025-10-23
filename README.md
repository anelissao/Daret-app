# Daret API (Node.js, Express, MongoDB)

Secure, clean, beginner-friendly REST API for a rotating savings group system. This initial version implements user registration and authentication with JWT.

## Features
- **User registration** with name, email, password, and ID card info
- **JWT authentication** with roles (`user`, `admin`)
- **Protected route** to fetch current user (`/v1/auth/me`)
- **Input validation** using Joi
- **Security middlewares**: Helmet, CORS, rate limiting, mongo sanitize, XSS protection, HPP

## Getting Started

- **Prerequisites**
  - Node.js 18+
  - MongoDB running locally or connection string

- **Setup**
  1. Install dependencies
  ```bash
  npm install
  ```
  2. Create `.env` from `.env.example` and fill values
  ```bash
  cp .env.example .env
  ```
  3. Run in development
  ```bash
  npm run dev
  ```
  4. Or production
  ```bash
  npm start
  ```

## API

- **POST** `/v1/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPass123",
  "idCard": { "number": "ABC123", "type": "passport" }
}
```

- **POST** `/v1/auth/login`
```json
{
  "email": "jane@example.com",
  "password": "StrongPass123"
}
```

- **GET** `/v1/auth/me`
  - Header: `Authorization: Bearer <token>`

## Project Structure
```
src/
  app.js
  server.js
  controllers/
    AuthController.js
  middleware/
    auth.js
  models/
    User.js
  routes/
    v1/
      auth.routes.js
      index.js
  services/
    AuthService.js
  shared/
    config/
      index.js
    database/
      mongoose.js
    middleware/
      error.js
    utils/
      ApiError.js
  validation/
    auth.validation.js
```

## Notes
- Passwords are hashed using bcrypt before storage.
- JWT is returned on register and login.
- Adjust `.env` to match your MongoDB connection and JWT settings.
