# Как запускать
1. Создать .env файл в папке backend:

	```
	MONGODB_USER_NAME=admin
	MONGODB_USER_PASSWORD=пароль
	MONGODB_HOST=127.0.0.1
	MONGODB_PORT=29017
	MONGODB_DATABASE_NAME=Intellectika
	PROJECT_NAME=Intellectika
	MONGODB_DATABASE_AUTH_NAME=admin
	PORT=4336
	JWT_SECRET=secret-hello
	```

2. Запустить `npm install`

3. Перейти в папку `backend` и запустить

	`docker-compose up -d`

	Дождаться, когда запустится контейнер, там запускается база данных MongoDb

4. Запустить `npm run start` в корне