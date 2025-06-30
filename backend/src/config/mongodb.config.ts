import { ConfigService } from '@nestjs/config';

export const getMongoConnectionString = (
	configService: ConfigService
): string => {
	// Получаем значения из переменных окружения через ConfigService
	const username = configService.get<string>('MONGODB_USER_NAME');
	const password = configService.get<string>('MONGODB_USER_PASSWORD');
	const host = configService.get<string>('MONGODB_HOST');
	const port = process.env.IS_DOCKER === 'true' ? 27017 : Number(configService.get<string>('MONGODB_PORT'));
	const projectName = configService.get<string>('PROJECT_NAME');
	const databaseName = configService.get<string>('MONGODB_DATABASE_NAME');
	const databaseAuthName = configService.get<string>(
		'MONGODB_DATABASE_AUTH_NAME'
	);
	const replicaSet = configService.get<string>('MONGODB_REPLICA_SET');

	// Проверка, что все обязательные параметры присутствуют
	if (
		!username ||
		!password ||
		!host ||
		!port ||
		!databaseName ||
		!databaseAuthName ||
		!projectName ||
		!replicaSet
	) {
		throw new Error(
			'Отсутствуют параметры конфигурации для подключения к MongoDB'
		);
	}

	// Кодируем имя пользователя и пароль для использования в URL
	const encodedUsername = encodeURIComponent(username);
	const encodedPassword = encodeURIComponent(password);

	// Формируем и возвращаем строку подключения к MongoDB
	const uri = `mongodb://${encodedUsername}:${encodedPassword}@${host}:${port}/${databaseName}?authSource=${databaseAuthName}&replicaSet=${replicaSet}&readPreference=primary`;

	console.log(uri)

	return uri;
};

