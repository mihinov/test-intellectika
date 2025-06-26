import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConnectionString } from './config/mongodb.config';
import { JoiPipeModule } from 'nestjs-joi';
import { getConfigJoi } from './config/joi.config';
import { PassRequestsModule } from './modules/pass-requests/pass-requests.module';

const featureModules = [
  AuthModule,
  UserModule,
];

@Module({
	imports: [
		...featureModules,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: getMongoConnectionString(configService)
      }),
    }),
		JoiPipeModule.forRoot({
			pipeOpts: {
				defaultValidationOptions: getConfigJoi()
			}
		}),
		PassRequestsModule,
	],
	controllers: [],
})
export class AppModule {}
