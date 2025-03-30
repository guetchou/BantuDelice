
# Buntudelice Backend API

This repository contains the backend API for the Buntudelice application.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository
```
git clone https://github.com/your-organization/buntudelice-backend.git
cd buntudelice-backend
```

2. Install dependencies
```
npm install
```

3. Configure environment variables
```
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Run the migrations
```
npm run migrate
```

5. Seed the database (optional)
```
npm run seed
```

### Running the Application

#### Development mode
```
npm run dev
```

#### Production mode
```
npm start
```
or using PM2:
```
npm run prod
```

### Docker Deployment

#### Development

Build and start the containers:
```
npm run docker:build
npm run docker:up
```

View logs:
```
npm run docker:logs
```

Stop the containers:
```
npm run docker:down
```

#### Production

Start production containers:
```
npm run docker:prod
```

View logs:
```
npm run docker:prod:logs
```

Stop the containers:
```
npm run docker:prod:down
```

## API Documentation

API documentation is available at `/api/docs` when the server is running.

## Running Tests

```
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
