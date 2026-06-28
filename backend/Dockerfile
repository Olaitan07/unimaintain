# Backend Dockerfile for production
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY backend/package.json backend/package-lock.json ./
COPY backend/tsconfig.json backend/tsconfig.build.json ./
COPY backend/prisma ./prisma

RUN npm install

COPY backend .
RUN npm run build

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
