# Use Node.js 22 slim image as base
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy application code
COPY app.js ./

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["node", "app.js"]
