import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Если это HttpException - берём статус и тело
    let status: number;
    let responseBody: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      responseBody = exception.getResponse();
    } else {
      // Не HttpException — Internal Server Error
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        message: 'Internal server error',
      };
    }

    // Попытка достать сообщение
    let message: any = responseBody;
    if (typeof responseBody === 'object' && responseBody !== null) {
      message = responseBody.message || responseBody.error || responseBody;
    }

    // Убираем лишние префиксы ошибок Joi (если есть)
    if (typeof message === 'string') {
      message = message.replace(/^Request validation of body failed, because: /, '').trim();
    }

    const protocol = request.protocol || 'http';
    const hostName = request.get('host') || 'localhost';
    const fullUrl = `${protocol}://${hostName}${request.originalUrl || request.url}`;

    // Логируем ошибку в консоль с полным стеком
    console.error('🔥 Exception caught by filter:');
    console.error(exception);

    response.status(status).json({
      statusCode: status,
      message,
      error:
        (typeof responseBody === 'object' && responseBody?.error) ||
        (typeof message === 'string' ? message : 'Error'),
      timestamp: new Date().toISOString(),
      path: fullUrl,
			method: request.method
    });
  }
}
