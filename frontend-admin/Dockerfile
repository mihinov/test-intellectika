FROM node:22

WORKDIR /app

COPY . .

RUN npm ci

CMD ["sh", "-c", "npm run start:docker -- --port $PORT --host 0.0.0.0"]
