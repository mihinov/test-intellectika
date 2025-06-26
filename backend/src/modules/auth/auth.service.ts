// oxlint-disable no-unused-vars
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginEmailPasswordDto } from './dto/auth-login.dto';
import { AuthRegisterEmailPasswordDto } from './dto/auth-register.dto';
import { RequestUserDto } from './dto/request-user.dto';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcryptjs';
import { UserDto } from '../user/model/dto/user.response.dto';

@Injectable()
export class AuthService {

	constructor(
		private readonly _userService: UserService,
		private readonly _jwtService: JwtService
	) {}

	async getMe(req: RequestUserDto): Promise<UserDto | null> {
		const reqUser = req.user as any;
		const realUser = await this._userService.getUserById(reqUser._id);

		if (realUser === null) {
			throw new UnauthorizedException('Пользователь не найден');
		}


		return this._userService.createReturnedUserDto(realUser);
	}

	async loginEmailPassword(authLoginEmailPasswordDto: AuthLoginEmailPasswordDto) {
		const user = await this._validateUserEmailPassword(authLoginEmailPasswordDto) as any;

		const { password, __v, iat, ...payload } = user._doc;

		return {
			access_token: await this._jwtService.signAsync(payload)
		};
	}

	public async registerEmailPassword(authRegisterEmailPasswordDto: AuthRegisterEmailPasswordDto): Promise<User> {
		const foundedUser: User | null = await this._userService.getUserByEmail(authRegisterEmailPasswordDto.email);

		if (foundedUser !== null) {
			throw new UnauthorizedException(`Пользователь email: ${authRegisterEmailPasswordDto.email} уже зарегистрирован`);
		}

		const salt: string = bcrypt.genSaltSync(10);

		const createdUser: User = await this._userService.createUser({
			...authRegisterEmailPasswordDto,
			password: bcrypt.hashSync(authRegisterEmailPasswordDto.password, salt)
		});

		return createdUser;
	}

	private async _validateUserEmailPassword({ email, password }: AuthLoginEmailPasswordDto): Promise<User> {
		const foundedUser: User | null = await this._userService.getUserByEmail(email);

		if (!foundedUser) {
			throw new UnauthorizedException(`Пользователь c данным email не существует`);
		}

		const isCorrectPassword: boolean = bcrypt.compareSync(password, foundedUser.password);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(`Введён некорректный пароль`);
		}

		return foundedUser;
	}

	async loginEmailPasswordAdmin(authLoginEmailPasswordDto: AuthLoginEmailPasswordDto) {
		const user = await this._validateUserEmailPassword(authLoginEmailPasswordDto);

		if (user.role !== 'admin') {
			throw new UnauthorizedException('Доступ разрешён только администраторам');
		}

		const { password, __v, iat, ...payload } = (user as any)._doc;

		return {
			access_token: await this._jwtService.signAsync(payload)
		};
	}
}
