import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";
import { readFileSync } from 'node:fs';
import { analyzeRoutes } from './shared/utils/analyze-routes';
import { AllExceptionsFilter } from './shared/exceptions/custom-exception';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get<number>('PORT')!;
	const urlServer = `http://localhost:${port}`;
	const swaggerCustomJsStr = readFileSync(join(__dirname, '..', 'src/assets/swagger-custom.js'), 'utf8');
	const swaggerPathName = 'docs';
	const projectName = configService.get<string>('PROJECT_NAME');

	app.setGlobalPrefix('api');

	const config = new DocumentBuilder()
		.setTitle(`${projectName} документация`)
		.setDescription(`${projectName} API описание`)
		// .setVersion('1.0')
		// .addTag('cats')
		.addTag('auth', 'Аутентификация пользователя')
		.addTag('pass-requests', 'Получение и отслеживание статуса пропуска')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup(swaggerPathName, app, document, {
		customJsStr: swaggerCustomJsStr
  });

	app.useGlobalFilters(new AllExceptionsFilter());

	await app.listen(port, () => {
		void analyzeRoutes();
		console.log(`\nСервер запущен: ${urlServer}`);
		console.log(`Swagger: ${urlServer}/${swaggerPathName}`);
	});

}
void bootstrap();
