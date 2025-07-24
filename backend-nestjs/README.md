
# Buntudelice Backend API

This repository contains the backend API for the Buntudelice application, a food and service delivery platform for the Congo.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-organization/buntudelice-backend.git
cd buntudelice-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Run the migrations
```bash
npm run migrate
```

5. Seed the database (optional)
```bash
npm run seed
```

### Running the Application

#### Development mode
```bash
npm run dev
```

#### Production mode
```bash
npm start
```
or using PM2:
```bash
npm run prod
```

### Docker Deployment

#### Quick Setup

For a complete setup with one command:

```bash
npm run docker:setup     # For development
npm run docker:prod:setup  # For production
```

#### Development

Build and start the containers:
```bash
npm run docker:build
npm run docker:up
```

View logs:
```bash
npm run docker:logs
```

Stop the containers:
```bash
npm run docker:down
```

#### Production

Start production containers:
```bash
npm run docker:prod
```

View logs:
```bash
npm run docker:prod:logs
```

Stop the containers:
```bash
npm run docker:prod:down
```

## API Documentation

API documentation is available at `/api/docs` when the server is running.

## Project Structure

```
.
├── config/              # Configuration files
├── controllers/         # Request handlers
├── db/                  # Database files and migrations
├── middleware/          # Express middleware
├── models/              # Database models
├── routes/              # API routes
├── scripts/             # Utility scripts
├── utils/               # Helper functions
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── Dockerfile           # Docker build file
├── docker-compose.yml   # Docker Compose configuration
├── server.js            # Application entry point
└── package.json         # Project metadata
```

## Running Tests

```bash
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
