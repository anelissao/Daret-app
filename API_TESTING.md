# API Endpoints Postman Collection

You can import this collection into Postman for testing.

## Setup

1. Create an environment in Postman
2. Add variable `baseUrl` = `http://localhost:3000/api`
3. Add variable `token` (will be set automatically after login)

## Test Flow

1. **Register**: POST /auth/register
2. **Login**: POST /auth/login (saves token automatically)
3. **Get Profile**: GET /users/profile
4. **Create Group**: POST /groups
5. **Join Group**: POST /groups/:id/join
6. **Start Group**: POST /groups/:id/start
7. **Record Contribution**: POST /contributions

For detailed endpoint documentation, see README.md
