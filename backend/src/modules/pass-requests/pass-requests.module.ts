import { Module } from '@nestjs/common';
import { PassRequestsController } from './pass-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassRequests, PassRequestsSchema } from './pass-requests.schema';
import { PassStatusesModule } from '../pass-statuses/pass-statuses.module';
import { PassRequestsService } from './services/pass-requests.service';
import { MongoChangeStreamService } from 'src/shared/services/mongo-change-stream.service';
import { PassRequestsStreamService } from './services/pass-requests-stream.service';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: PassRequests.name, schema: PassRequestsSchema }]),
		PassStatusesModule,
		UserModule,
		PassStatusesModule
	],
  controllers: [PassRequestsController],
  providers: [
		PassRequestsService,
		MongoChangeStreamService,
		PassRequestsStreamService
	]
})
export class PassRequestsModule {}
