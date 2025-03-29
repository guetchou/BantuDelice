
# Buntudelice Backend API

This is the backend API for the Buntudelice application, providing authentication, restaurant, and order management services.

## Features

- User authentication (login/register)
- Restaurant listing and filtering
- Order management
- Real-time delivery tracking
- Feature flags for modular functionality
- Docker containerization
- CI/CD integration with GitHub Actions

## Setup and Installation

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Docker and Docker Compose (optional)

### Local Development Setup

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```
4. Configure your MySQL database
5. Start the development server
   ```
   npm run dev
   ```

### Using Docker

1. Build and start the containers
   ```
   npm run docker:up
   ```
   
   Or manually:
   ```
   docker-compose up -d
   ```

2. Stop the containers:
   ```
   npm run docker:down
   ```
   
   Or manually:
   ```
   docker-compose down
   ```

3. View logs:
   ```
   docker-compose logs -f api
   ```

## Environment Variables

Create a `.env` file with the following variables:

```dotenv
NODE_ENV=development
PORT=5000

# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=buntudelice
DB_PASSWORD=your_password
DB_NAME=buntudelice

# JWT configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Feature flags
FEATURE_CHATBOT=true
FEATURE_ANALYTICS=true
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Restaurants

- `GET /api/restaurants` - List restaurants with optional filtering
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu items

### Orders

- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create a new order
- `PATCH /api/orders/:id` - Update order details

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. On push to any branch: 
   - Run tests and linting

2. On push to main branch:
   - Run tests and linting
   - Build Docker image
   - Push to Docker registry
   - Deploy to production server

## Feature Flags

The application supports feature flags for toggling functionality:

- `FEATURE_CHATBOT` - Enable/disable chat support
- `FEATURE_ANALYTICS` - Enable/disable analytics collection

Configure these in the `.env` file.

## Security Measures

1. Use `helmet` middleware for setting secure HTTP headers
2. Rate limiting for API endpoints
3. Input validation and sanitization
4. JWT token authentication with expiration
5. Secure storage of sensitive data
6. Non-root user in Docker container

## Monitoring

The application uses PM2 for production process management:

```
npm run prod
```

This allows for:
- Automatic restarts on crashes
- Load balancing
- Runtime performance and error logging

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify database credentials in `.env`
   - Check if MySQL server is running

2. **JWT Token Issues**
   - Check if JWT_SECRET is properly set in environment
   - Verify token expiration time

3. **Docker Issues**
   - Run `docker-compose logs` to view container logs
   - Check port mappings if services are unavailable

