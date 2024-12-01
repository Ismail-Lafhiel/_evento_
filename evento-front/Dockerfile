# Build stage
FROM node:20-alpine AS builder

# Install additional debugging tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# Copy source code
COPY . .

# Debug: List files and check Node version
RUN ls -la
RUN node -v
RUN npm -v

# Debug: Show environment
RUN env

# Add build debugging
RUN echo "Content of package.json:"
RUN cat package.json

# Try to run build with more debugging info
RUN NODE_ENV=production npm run build --verbose || (echo "Build failed" && npm run build --verbose && exit 1)

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
