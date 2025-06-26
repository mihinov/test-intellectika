import { Module } from '@nestjs/common';
import { PassRequestsController } from './pass-requests.controller';
import { PassRequestsService } from './pass-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassRequests, PassRequestsSchema } from './pass-requests.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: PassRequests.name, schema: PassRequestsSchema }])
	],
  controllers: [PassRequestsController],
  providers: [PassRequestsService]
})
export class PassRequestsModule {}
