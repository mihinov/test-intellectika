import { ConfigService } from '@nestjs/config';

export const getMongoConnectionString = (
	configService: ConfigService
): string => {
	// Получаем значения из переменных окружения через ConfigService
	const username = configService.get<string>('MONGODB_USER_NAME');
	const password = configService.get<string>('MONGODB_USER_PASSWORD');
	const host = configService.get<string>('MONGODB_HOST');
	const port = configService.get<number>('MONGODB_PORT');
	const projectName = configService.get<number>('PROJECT_NAME');
	const databaseName = configService.get<number>('MONGODB_DATABASE_NAME');
	const databaseAuthName = configService.get<number>(
		'MONGODB_DATABASE_AUTH_NAME'
	);

	// Проверка, что все обязательные параметры присутствуют
	if (
		!username ||
		!password ||
		!host ||
		!port ||
		!databaseName ||
		!databaseAuthName ||
		!projectName
	) {
		throw new Error(
			'Отсутствуют параметры конфигурации для подключения к MongoDB'
		);
	}

	// Кодируем имя пользователя и пароль для использования в URL
	const encodedUsername = encodeURIComponent(username);
	const encodedPassword = encodeURIComponent(password);

	// Формируем и возвращаем строку подключения к MongoDB
	const uri = `mongodb://${encodedUsername}:${encodedPassword}@${host}:${port}/${databaseName}?authSource=${databaseAuthName}`;

	return uri;
};
