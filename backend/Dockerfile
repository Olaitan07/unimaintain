FROM node:20-slim
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV PORT=4000

COPY package*.json ./
COPY tsconfig.json tsconfig.build.json ./
COPY prisma ./prisma

RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
