# Daret API (Node.js, Express, MongoDB)

Secure, clean, beginner-friendly REST API for a rotating savings group system. This initial version implements user registration and authentication with JWT.

## Features
- **User registration** with name, email, password, and ID card info
- **JWT authentication** with roles (`user`, `admin`)
- **Protected route** to fetch current user (`/v1/auth/me`)
- **Input validation** using Joi
- **Security middlewares**: Helmet, CORS, rate limiting, mongo sanitize, XSS protection, HPP
 - **KYC (identity verification)**: encrypted uploads, simulated face verification, admin approve/reject

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

### KYC

- **GET** `/v1/kyc/status`
  - Returns current user's KYC status and metadata.
- **POST** `/v1/kyc/upload`
  - Header: `Authorization: Bearer <token>`
  - Multipart form fields: `idFront`, `idBack`, `selfie` (images JPEG/PNG/WEBP, max 5MB each)
- **POST** `/v1/kyc/verify-face`
  - Header: `Authorization: Bearer <token>`
  - Simulates facial verification and sets status to `pending_review`.
- **POST** `/v1/kyc/:userId/approve` (admin)
- **POST** `/v1/kyc/:userId/reject` (admin) with optional JSON `{ "reason": "..." }`

Encrypted files are stored under `storage/kyc/` using AES-256-GCM with `KYC_ENCRYPTION_KEY`.

## Project Structure
```
src/
  app.js
  server.js
  controllers/
    AuthController.js
    KycController.js
  middleware/
    auth.js
    kyc.js
  models/
    User.js
  routes/
    v1/
      auth.routes.js
      kyc.routes.js
      index.js
  services/
    AuthService.js
    KycService.js
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
- Set `KYC_ENCRYPTION_KEY` (32 bytes). Example: `openssl rand -hex 32` and paste result into `.env`.
- Use `requireVerified` middleware (`src/middleware/kyc.js`) to block sensitive actions (e.g., group creation, contributions, transfers) until KYC is verified:

```js
import { authenticate } from '../middleware/auth.js';
import { requireVerified } from '../middleware/kyc.js';
router.post('/groups', authenticate, requireVerified, controller.createGroup);
```
