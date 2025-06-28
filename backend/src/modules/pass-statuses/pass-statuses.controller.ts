import { Controller, Get, UseGuards } from '@nestjs/common';
import { PassStatusesService } from './pass-statuses.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('pass-statuses')
@Controller('pass-statuses')
export class PassStatusesController {
	constructor(
		private readonly _passStatusesService: PassStatusesService
	) { }

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get()
	getAll() {
		return this._passStatusesService.getAll();
	}
}
