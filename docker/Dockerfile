FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY app.js ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S pixeldrain -u 1001

# Change ownership of the app directory
RUN chown -R pixeldrain:nodejs /app
USER pixeldrain

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "app.js"]