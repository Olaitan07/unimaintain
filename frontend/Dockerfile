# Frontend Dockerfile for production
FROM node:20-alpine AS builder
WORKDIR /app

COPY frontend/package*.json ./
COPY frontend/tsconfig.json frontend/vite.config.ts frontend/postcss.config.js ./

RUN npm install

COPY frontend .

RUN npm run build

FROM nginx:alpine AS runner
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
