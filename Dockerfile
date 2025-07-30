# Use Node.js 22 Alpine as base image
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (skip prepare script)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Build the application (skip GraphQL type generation for Docker builds)
RUN pnpm run build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies (skip prepare script)
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy built application from build stage
COPY --from=base /app/build ./build

# Copy public assets
COPY --from=base /app/public ./public

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"] 