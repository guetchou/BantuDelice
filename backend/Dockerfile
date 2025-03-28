
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose API port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
