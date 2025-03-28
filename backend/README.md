
# Buntudelice Backend API

This is the backend API for the Buntudelice application, providing authentication, restaurant, taxi, and order management services.

## Features

- User authentication (login/register)
- Restaurant listing and filtering
- Menu management system
- Order management and tracking
- Taxi booking and ride management
- Delivery tracking in real-time
- Payment processing
- Feature flags for modular functionality
- Docker containerization
- CI/CD integration with GitHub Actions

## Technical Architecture

The backend is built with:
- Node.js 18+ and Express
- MySQL 8.0 database
- JWT for authentication
- Docker and Docker Compose for containerization
- PM2 for process management in production

## Setup and Installation

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Docker and Docker Compose (optional)

### Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/Ambangue/BuntuDelice42.git
   cd BuntuDelice42/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Configure your MySQL database in the `.env` file

5. Start the development server
   ```
   npm run dev
   ```

### Using Docker

1. Build and start the containers
   ```
   docker-compose up -d
   ```

2. View logs
   ```
   docker-compose logs -f
   ```

3. Stop the containers
   ```
   docker-compose down
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

### Taxi

- `POST /api/taxi/rides` - Create a new taxi ride
- `GET /api/taxi/rides` - Get user's taxi rides
- `GET /api/taxi/rides/:id` - Get ride details
- `PATCH /api/taxi/rides/:id` - Update ride status

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. On push to any branch: 
   - Run tests and linting

2. On push to main branch:
   - Run tests and linting
   - Build Docker image
   - Push to Docker registry
   - Deploy to production server

## Health Checks

The application includes health check endpoints:

- `GET /health` - Returns 200 OK if the application is running

Docker containers are configured with health checks to monitor the application status.

## Feature Flags

The application supports feature flags for toggling functionality:

- `FEATURE_CHATBOT` - Enable/disable chat support
- `FEATURE_ANALYTICS` - Enable/disable analytics collection
- `FEATURE_TAXI` - Enable/disable taxi booking functionality

Configure these in the `.env` file.

## Monitoring and Logging

The application uses PM2 for production process management:

```
npm run prod
```

This allows for:
- Automatic restarts on crashes
- Load balancing
- Runtime performance and error logging

## Database Migrations

The database schema is defined in `init-db.sql` and applied automatically when using Docker.

For manual migrations, look at the SQL scripts in the `migrations` directory.

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is configured to restrict cross-origin requests
- Environment variables are used for sensitive configuration

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
