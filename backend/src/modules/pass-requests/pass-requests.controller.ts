import { Body, Controller, Get, Post, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PassRequestsService } from './pass-requests.service';
import { PassRequestCreateDto } from './model/dto/pass-request-create.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { PassRequestChangeStatusDto } from './model/dto/pass-request-change-status.dto';

@ApiTags('pass-requests')
@Controller('pass-requests')
export class PassRequestsController {
	constructor(
		private readonly _passRequestsService: PassRequestsService
	) {}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get()
	getByUser(@Request() req: RequestUserDto) {
		return this._passRequestsService.getById(req);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Post()
	create(
		@Body() passRequestCreateDto: PassRequestCreateDto,
		@Request() req: RequestUserDto
	) {
		return this._passRequestsService.create(passRequestCreateDto, req);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Patch('change-status/:id')
	changeStatus(
		@Param('id') passRequestId: string,
		@Body() passRequestChangeStatusDto: PassRequestChangeStatusDto,
		@Request() req: RequestUserDto
	) {
		return this._passRequestsService.changeStatus(passRequestId, passRequestChangeStatusDto, req);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Get('all')
	getAll() {
		return this._passRequestsService.getAll();
	}
}
