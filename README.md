# Daret API - Digital Tontine Management System

A secure backend API for managing digital "Daret" (tontine/collective savings) groups where members contribute monthly and receive the collective pot in turns.

## Features

- **User Management**: Registration, authentication with JWT, and KYC verification
- **Group Management**: Create and manage savings groups with customizable rules
- **Contribution Tracking**: Record and track member contributions with payment history
- **Reliability Scoring**: Automatic scoring system based on payment punctuality and regularity
- **Communication**: Group messaging with text and audio support
- **Ticket System**: Issue reporting and resolution workflow
- **Admin Dashboard**: Complete oversight and management capabilities
- **Automated Notifications**: Payment reminders and turn notifications

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Testing**: Jest & Supertest
- **Container**: Docker & Docker Compose

## Architecture

The project follows an **n-tier architecture**:

```
src/
├── config/          # Database and JWT configuration
├── models/          # Mongoose data models
├── controllers/     # Request handlers
├── services/        # Business logic layer
├── middleware/      # Authentication, validation, error handling
├── routes/          # API route definitions
├── utils/           # Helper functions and error classes
├── validators/      # Joi validation schemas
├── __tests__/       # Jest unit and integration tests
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Daret-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/daret
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the application:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The API will be available at `http://localhost:3000`

### Manual Docker Build

```bash
# Build image
docker build -t daret-api .

# Run container
docker run -p 3000:3000 --env-file .env daret-api
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0612345678"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### User Management

**Get Profile** (Requires Auth)
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Update Profile** (Requires Auth)
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0612345678"
}
```

**Submit KYC** (Requires Auth)
```http
POST /api/users/kyc
Authorization: Bearer <token>
Content-Type: application/json

{
  "idCardNumber": "AB123456",
  "idCardImage": "path/to/image.jpg",
  "selfieImage": "path/to/selfie.jpg"
}
```

**Get Reliability Score** (Requires Auth)
```http
GET /api/users/reliability-score
Authorization: Bearer <token>
```

#### Groups

**Create Group** (Requires Auth & KYC)
```http
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Monthly Savings Group",
  "description": "Save together, prosper together",
  "contributionAmount": 1000,
  "frequency": "monthly",
  "rules": {
    "maxMembers": 10,
    "minReliabilityScore": 50,
    "autoStart": false
  }
}
```

**Get User Groups** (Requires Auth)
```http
GET /api/groups
Authorization: Bearer <token>
```

**Get Group Details** (Requires Auth)
```http
GET /api/groups/:id
Authorization: Bearer <token>
```

**Join Group** (Requires Auth & KYC)
```http
POST /api/groups/:id/join
Authorization: Bearer <token>
```

**Update Group** (Requires Auth & KYC, Creator Only)
```http
PUT /api/groups/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Group Name",
  "contributionAmount": 1200
}
```

**Start Group** (Requires Auth & KYC, Creator Only)
```http
POST /api/groups/:id/start
Authorization: Bearer <token>
```

**Get Group History** (Requires Auth)
```http
GET /api/groups/:id/history
Authorization: Bearer <token>
```

#### Contributions

**Record Contribution** (Requires Auth & KYC)
```http
POST /api/contributions
Authorization: Bearer <token>
Content-Type: application/json

{
  "groupId": "group123",
  "amount": 1000,
  "paymentProof": "proof.jpg",
  "notes": "Monthly contribution"
}
```

**Get Group Contributions** (Requires Auth & KYC)
```http
GET /api/contributions/group/:groupId
Authorization: Bearer <token>
```

**Get My Contributions** (Requires Auth & KYC)
```http
GET /api/contributions/my-contributions
Authorization: Bearer <token>
```

#### Messages

**Send Message** (Requires Auth)
```http
POST /api/groups/:groupId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "messageType": "text",
  "content": "Hello everyone!"
}
```

**Get Group Messages** (Requires Auth)
```http
GET /api/groups/:groupId/messages?limit=50&skip=0
Authorization: Bearer <token>
```

#### Tickets

**Create Ticket** (Requires Auth)
```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Payment Issue",
  "description": "Having problems with payment processing",
  "category": "payment",
  "priority": "high",
  "group": "group123"
}
```

**Get My Tickets** (Requires Auth)
```http
GET /api/tickets
Authorization: Bearer <token>
```

**Update Ticket** (Requires Auth)
```http
PUT /api/tickets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved"
}
```

**Add Response to Ticket** (Requires Auth)
```http
POST /api/tickets/:id/response
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Thanks for reporting, we're looking into it"
}
```

#### Admin Endpoints

All admin endpoints require Admin role.

**Get All Groups**
```http
GET /api/admin/groups?status=active
Authorization: Bearer <admin-token>
```

**Get All Users**
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

**Get Pending KYC Verifications**
```http
GET /api/admin/kyc/pending
Authorization: Bearer <admin-token>
```

**Verify KYC**
```http
PUT /api/admin/kyc/:userId/verify
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "approved": true,
  "rejectionReason": null
}
```

**Get All Tickets**
```http
GET /api/admin/tickets?status=open&priority=high
Authorization: Bearer <admin-token>
```

**Get Statistics**
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

**Coverage Target**: 80%+ coverage for all services and controllers

## Reliability Score System

The reliability score is automatically calculated based on:

- **On-time payments**: Positive impact
- **Late payments**: Moderate penalty (-20 points per rate)
- **Missed payments**: Heavy penalty (-40 points per rate)
- **Average delay**: -2 points per day of average delay

Score ranges from 0-100, with new users starting at 100.

## Security Features

- **JWT Authentication**: Secure token-based auth with configurable expiration
- **Password Hashing**: bcrypt with salt rounds
- **KYC Verification**: Multi-step verification process (ID card + selfie)
- **Role-Based Access Control**: Admin and Particulier roles
- **Input Validation**: Joi schemas for all endpoints
- **Error Handling**: Centralized error handling with proper status codes

## KYC Verification

The KYC system includes:

1. **Data Collection**: ID card number, ID card image, selfie image
2. **Verification Status**: pending → approved/rejected
3. **Manual Verification**: Admin review and approval
4. **Future Integration**: Prepared for facial recognition (face-api.js or LLM)

> **Note**: Sensitive actions (group creation, contributions) require KYC verification.

## Notifications

Automated notifications include:

- **Payment Reminders**: Sent 2 days before due date (daily at 9 AM)
- **Turn Notifications**: When it's a member's turn to receive funds
- **Group Updates**: Status changes and important events

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resources)
- `500` - Internal Server Error

Error responses follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": []
}
```

## Project Structure Details

### Models

- **User**: User accounts with KYC and reliability scoring
- **Group**: Savings groups with members and rules
- **Contribution**: Payment tracking with status and history
- **ReliabilityScore**: Automated scoring based on payment behavior
- **Message**: Group communication (text/audio)
- **Ticket**: Issue reporting and tracking
- **Notification**: User notifications and reminders

### Services

Business logic layer handling:

- Authentication and authorization
- Group lifecycle management
- Contribution processing and validation
- Reliability score calculations
- KYC verification workflow
- Messaging and ticket management
- Notification scheduling

## Contributing

This project follows standard development practices:

1. Feature development in separate branches
2. Comprehensive testing for all new features
3. Code review before merging
4. Maintain 80%+ test coverage

## License

ISC

## Deployment Notes

### Production Checklist

- [ ] Update JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB connection string
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Configure file upload limits
- [ ] Set up MongoDB backups
- [ ] Configure logging service
- [ ] Set up monitoring

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-secret-key
JWT_EXPIRE=7d
UPLOAD_PATH=/var/www/uploads
MAX_FILE_SIZE=5242880
```

## Support

For issues or questions, create a ticket through the API or contact the development team.
