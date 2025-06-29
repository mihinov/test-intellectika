const fs = require('fs');
const path = require('path');

function generateEnvFiles() {
  const envContent = `
# MongoDB
MONGODB_USER_NAME=admin
MONGODB_USER_PASSWORD=password
MONGODB_HOST=127.0.0.1
MONGODB_PORT=29017
MONGODB_DATABASE_NAME=intellectika-5
MONGODB_DATABASE_AUTH_NAME=admin
MONGODB_REPLICA_SET=rs0
MONGODB_REPLICA_SET_HOST=127.0.0.1

# Backend
PROJECT_NAME=intellectika
PORT=4336
JWT_SECRET=secret-hello

# Frontend
FRONTEND_PORT=4700
FRONTEND_ADMIN_PORT=4600
`.trim();

  const envPaths = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', 'backend', '.env'),
    path.join(__dirname, '..', 'frontend', '.env'),
    path.join(__dirname, '..', 'frontend-admin', '.env'),
  ];

  envPaths.forEach((envPath) => {
    const dir = path.dirname(envPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`.env файл успешно создан по пути: ${envPath}`);
  });
}


function main() {
  generateEnvFiles();
}

main();
