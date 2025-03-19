
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
   docker-compose up -d
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

## Monitoring

The application uses PM2 for production process management:

```
npm run prod
```

This allows for:
- Automatic restarts on crashes
- Load balancing
- Runtime performance and error logging
