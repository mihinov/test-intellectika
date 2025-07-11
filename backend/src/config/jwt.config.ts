import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTconfig = (
	configService: ConfigService
): JwtModuleOptions => {
	return {
		secret: configService.get('JWT_SECRET')
		//signOptions: { expiresIn: '60m' }
	};
};
