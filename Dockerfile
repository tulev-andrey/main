FROM node:lts AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

# Копируем необходимые ключи и сертификаты
COPY keys/root.crt /app/keys/root.crt
COPY keys/credentials.b64 /app/keys/credentials.b64

# Копируем зависимости и билды
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Устанавливаем только прод-зависимости
RUN npm ci --omit=dev

CMD ["node", "dist/main.js"]