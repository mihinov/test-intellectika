import { Body, Controller, Get, Post, UseGuards, Request, Patch, Param, Sse } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PassRequestCreateDto } from './model/dto/pass-request-create.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { PassRequestChangeStatusDto } from './model/dto/pass-request-change-status.dto';
import { map, tap } from 'rxjs';
import { PassRequestsService } from './services/pass-requests.service';
import { PassRequestsStreamService } from './services/pass-requests-stream.service';

@ApiTags('pass-requests')
@Controller('pass-requests')
export class PassRequestsController {
	constructor(
		private readonly _passRequestsService: PassRequestsService,
		private readonly _passRequestsStreamService: PassRequestsStreamService
	) {}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get()
	getByUser(@Request() req: RequestUserDto) {
		return this._passRequestsService.getByUserId(req.user._id.toString());
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

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Sse('sse')
	getSSE(@Request() req: RequestUserDto) {
		return this._passRequestsStreamService.getByUserId(req.user._id.toString()).pipe(
			tap((data) => console.log('В потоке', data)),
			map((data) => ({
        data: JSON.stringify(data), // Преобразуем данные в строку
      })),
		)
	}
}
