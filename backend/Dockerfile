
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose API port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]

# Documentation
# This Dockerfile builds a production-ready container for the Buntudelice API
# It uses node:18-alpine as the base image for a smaller footprint
# The build process:
# 1. Sets up the working directory
# 2. Copies and installs production dependencies
# 3. Copies the application code
# 4. Sets the NODE_ENV to production
# 5. Exposes port 5000 for the API
# 6. Adds a health check to monitor the container
# 7. Starts the application using npm start
#
# To build: docker build -t buntudelice-api .
# To run: docker run -p 5000:5000 buntudelice-api
