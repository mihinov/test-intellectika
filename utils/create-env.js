const fs = require('fs');
const path = require('path');

const envContent = `
MONGODB_USER_NAME=admin
MONGODB_USER_PASSWORD=пароль
MONGODB_HOST=127.0.0.1
MONGODB_PORT=29017
MONGODB_DATABASE_NAME=Intellectika
PROJECT_NAME=Intellectika
MONGODB_DATABASE_AUTH_NAME=admin
PORT=4336
JWT_SECRET=secret-hello
`.trim();

const backendDir = path.join(__dirname, '..', 'backend');
const envPath = path.join(backendDir, '.env');

// Убедимся, что папка backend существует
if (!fs.existsSync(backendDir)) {
  fs.mkdirSync(backendDir, { recursive: true });
}

fs.writeFileSync(envPath, envContent, 'utf8');

console.log(`.env файл успешно создан по пути: ${envPath}`);
