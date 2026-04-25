# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy monorepo root dependency files (lockfile lives here)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy frontend package.json so pnpm can resolve workspace
COPY src/frontend/package.json ./src/frontend/

# Install all workspace deps
RUN pnpm install --frozen-lockfile

# Copy full frontend source
COPY src/frontend ./src/frontend

# Build
WORKDIR /app/src/frontend
RUN pnpm build

# Stage 2: Serve static files
FROM nginx:alpine AS runner
COPY --from=builder /app/src/frontend/dist /usr/share/nginx/html
COPY src/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
