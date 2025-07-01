import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthErrorDto, AuthValidationErrorDto } from './dto/auth-error.response.dto';
import { UserDto } from '../user/model/dto/user.response.dto';
import { AuthLoginEmailPasswordDto } from './dto/auth-login.dto';
import { AccessTokenDto } from './dto/acces-token.response.dto';
import { AuthRegisterEmailPasswordDto } from './dto/auth-register.dto';
import { RequestUserDto } from './dto/request-user.dto';
import { AdminGuard } from './guards/admin.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

	constructor(
		private readonly _authService: AuthService
	) {

	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Получает текущего авторизованного пользователя' })
	@ApiResponse({ status: 200, description: 'Текущий авторизованный пользователь', type: UserDto })
	@ApiUnauthorizedResponse({ description: 'Ошибка аутентификации', type : AuthErrorDto}) //401
	@UseGuards(JwtAuthGuard)
	@Get('me')
	getMe(@Request() req: RequestUserDto) {
		return this._authService.getMe(req);
	}

	@ApiOperation({ summary: 'Получает актуальный токен пользователя' })
	@ApiResponse({ status: 201, description: 'Текущий актуальный токен', type: AccessTokenDto })
	@ApiUnauthorizedResponse({ description: 'Ошибка аутентификации', type: AuthValidationErrorDto}) //401
	@Post('login')
	loginEmailPassword(
		@Body() authLoginEmailPasswordDto: AuthLoginEmailPasswordDto
	) {
		return this._authService.loginEmailPassword(authLoginEmailPasswordDto);
	}

	@ApiOperation({ summary: 'Получает актуальный токен пользователя' })
	@ApiResponse({ status: 201, description: 'Текущий актуальный токен', type: AccessTokenDto })
	@ApiUnauthorizedResponse({ description: 'Ошибка аутентификации', type: AuthValidationErrorDto}) //401
	@Post('registration')
	registerEmailPassword(
		@Body() authRegisterEmailPasswordDto: AuthRegisterEmailPasswordDto
	) {
		return this._authService.registerEmailPassword(authRegisterEmailPasswordDto);
	}

	@Get('admin-me')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAdminData(@Request() req: RequestUserDto) {
		return this._authService.getMe(req);
  }

	@Post('login-admin')
  async loginAdmin(
		@Body() authLoginEmailPasswordDto: AuthLoginEmailPasswordDto
	) {
		return this._authService.loginEmailPasswordAdmin(authLoginEmailPasswordDto);
  }
}
