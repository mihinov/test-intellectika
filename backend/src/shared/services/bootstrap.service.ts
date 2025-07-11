import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { PassStatusesService } from 'src/modules/pass-statuses/pass-statuses.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class BootstrapService implements OnModuleInit {
  constructor(
    private readonly _usersService: UserService,
    private readonly _authService: AuthService,
    private readonly _passStatusesService: PassStatusesService,
  ) {

  }

  async onModuleInit() {
    await this._createAdminUser();
    await this._createDefaultPassStatuses();
  }

  private async _createAdminUser(): Promise<void> {
    const userInfo = {
      email: 'kamahinmihail@gmail.com',
      password: '123',
      organization: 'Intellectika',
      phone: '8 906 333 33 33',
    };

    const existingUser = await this._usersService.getUserByEmail(userInfo.email);

    if (!existingUser) {
      await this._authService.registerEmailPasswordAdmin(userInfo);
      console.log('✅ Начальный пользователь создан');
    }
  }

  private async _createDefaultPassStatuses(): Promise<void> {
    const statusesInDb = await this._passStatusesService.getAllByTypeAndValue(
      PassStatusesService.DEFAULT_STATUSES,
    );

    if (statusesInDb.length === 0) {
      await this._passStatusesService.createInitStatuses();
      console.log('✅ Начальные статусы созданы');
    }
  }
}
