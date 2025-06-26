// oxlint-disable no-unused-vars
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


export class JwtAuthGuard extends AuthGuard('jwt') {
	handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Срок действия токена истёк');
      } else if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Невалидный токен');
      } else {
        throw new UnauthorizedException('Ошибка аутентификации');
      }
    }
    return user;
  }
}
