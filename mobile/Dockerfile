# Use Node.js LTS version
FROM node:18-alpine AS base

# Install dependencies for Expo CLI
RUN npm install -g @expo/cli

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port for Expo dev server
EXPOSE 8081

# Expose port for web bundle
EXPOSE 19006

# Start Expo dev server
CMD ["npm", "start"]
