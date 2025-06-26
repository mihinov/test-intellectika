import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/modules/user/model/enum/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не найден в запросе');
    }

    if (user.role !== UserRole.Admin) {
      throw new ForbiddenException('Доступ разрешён только администраторам');
    }

    return true;
  }
}
