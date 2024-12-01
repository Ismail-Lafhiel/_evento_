# Build stage
FROM node:20-alpine AS builder

# Install additional tools for debugging and building
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application
COPY . .

# Debug: Show versions and environment
RUN node -v
RUN npm -v
RUN echo "Listing directory contents:"
RUN ls -la

# Set environment variables
ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH

# Try building with different approaches
RUN echo "Starting build process..." && \
    if [ -f "vite.config.js" ]; then \
        echo "Found vite.config.js" && \
        cat vite.config.js; \
    fi && \
    echo "Package.json contents:" && \
    cat package.json && \
    echo "Starting build..." && \
    npm run build || \
    (echo "Build failed, retrying with more details..." && \
     npm run build --verbose)

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
