import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { readFileSync } from 'fs';
import { analyzeRoutes } from './shared/utils/analyze-routes';
import { AllExceptionsFilter } from './shared/exceptions/custom-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT')!;
  const swaggerCustomJsStr = readFileSync(join(__dirname, '..', 'src/assets/swagger-custom.js'), 'utf8');

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle(`${configService.get('PROJECT_NAME')} документация`)
    .setDescription(`${configService.get('PROJECT_NAME')} API описание`)
    .addTag('auth', 'Аутентификация пользователя')
    .addTag('pass-requests', 'Получение и отслеживание статуса пропуска')
    .addTag('pass-statuses', 'Типы статусов пропуска')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, { customJsStr: swaggerCustomJsStr });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, () => {
    void analyzeRoutes(app);
    console.log(`\n🚀 Сервер запущен: http://localhost:${port}`);
    console.log(`📘 Swagger: http://localhost:${port}/docs`);
  });
}

void bootstrap();
