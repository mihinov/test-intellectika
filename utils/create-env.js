// utils/create-env.js
const fs = require('fs');
const path = require('path');

const envContent = `
# MongoDB
MONGODB_USER_NAME=admin
MONGODB_USER_PASSWORD=пароль
MONGODB_HOST=127.0.0.1
MONGODB_PORT=29017
MONGODB_DATABASE_NAME=intellectika
MONGODB_DATABASE_AUTH_NAME=admin

# Backend
PROJECT_NAME=intellectika
PORT=4336
JWT_SECRET=secret-hello

# Frontend
FRONTEND_PORT=4700
FRONTEND_ADMIN_PORT=4600
`.trim();

// Пути к файлам .env
const paths = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', 'backend', '.env')
];

// Создаём файлы
paths.forEach(envPath => {
  const dir = path.dirname(envPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`.env файл успешно создан по пути: ${envPath}`);
});
