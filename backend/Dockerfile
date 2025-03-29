
FROM node:18-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -S nodeapp && \
    adduser -S -G nodeapp nodeapp && \
    chown -R nodeapp:nodeapp /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --production && \
    npm cache clean --force

# Copy application code
COPY . .

# Set ownership to non-root user
RUN chown -R nodeapp:nodeapp /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Use non-root user
USER nodeapp

# Expose API port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
