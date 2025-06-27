import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class BootstrapService implements OnModuleInit {
	constructor(private readonly _usersService: UserService) {}

	async onModuleInit() {
		const userInfo = {
			email: 'kamahinmihail@gmail.com',
			password: '123',
			organization: 'Intellectika',
			phone: '8 906 333 33 33',
		}
    const existingUser = await this._usersService.getUserByEmail(userInfo.email);

    if (!existingUser) {
      await this._usersService.createUserAdmin(userInfo);
      console.log('✅ Начальный пользователь создан');
    } else {
      console.log('ℹ️ Начальный пользователь уже существует');
    }
  }
}
