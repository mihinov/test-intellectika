import { Module } from '@nestjs/common';
import { PassStatusesController } from './pass-statuses.controller';
import { PassStatusesService } from './pass-statuses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassStatus, PassStatusSchema } from './pass-statuses.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: PassStatus.name, schema: PassStatusSchema }]),
		AuthModule
	],
  controllers: [PassStatusesController],
  providers: [PassStatusesService],
	exports: [
		PassStatusesService
	]
})
export class PassStatusesModule {}
