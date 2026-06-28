# Backend Dockerfile for production
FROM node:20-slim
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV PORT=4000

COPY backend/package*.json ./
COPY backend/tsconfig.json backend/tsconfig.build.json ./
COPY backend/prisma ./prisma

RUN npm install

COPY backend .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
