import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassRequests, PassRequestsDocument } from './pass-requests.schema';
import { Model } from 'mongoose';
import { AddField } from 'src/shared/utils/add-field';
import { User } from '../user/user.schema';
import { PassRequestCreateDto } from './model/dto/pass-request-create.dto';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { PassRequestStatus } from './model/enum/pass-request-status.enum';
import { PassRequestChangeStatusDto } from './model/dto/pass-request-change-status.dto';

@Injectable()
export class PassRequestsService {
	constructor(
		@InjectModel(PassRequests.name) private readonly _passRequestsModel: Model<PassRequestsDocument>
	) { }

	async getById(req: RequestUserDto) {
		const user = req.user as AddField<User, '_id', string>;

		return this._passRequestsModel
			.findOne({ user: user._id })
			.populate({
				path: 'user',
				select: '-password -__v -createdAt -updatedAt -_id', // убираем лишнее
			});
	}

	async create(passRequestCreateDto: PassRequestCreateDto, req: RequestUserDto): Promise<PassRequests> {
		const user = req.user as AddField<User, '_id', string>;

		// 1. Проверка: есть ли уже заявка от этого пользователя?
		const existingRequest = await this._passRequestsModel.findOne({ user: user._id });

		if (existingRequest) {
			throw new ConflictException('Вы уже подали заявку. Нельзя создать повторно.');
		}

		// 2. Создание новой заявки
		return this._passRequestsModel.create({
			visitPurpose: passRequestCreateDto.visitPurpose,
			user: user._id,
			status: PassRequestStatus.InProgress,
			statusHistory: [
				{
					status: PassRequestStatus.InProgress,
					changedAt: new Date(),
				},
			],
		});
	}

	async changeStatus(passRequestId: string, { status }: PassRequestChangeStatusDto, req: RequestUserDto) {
		const user = req.user as AddField<User, '_id', string>;

		const isAdmin = user.role === 'admin';

		if (!isAdmin) {
			throw new ForbiddenException('Нет прав на изменение статуса');
		}

		const passRequest = await this._passRequestsModel.findById(passRequestId);

		if (!passRequest) {
			throw new ConflictException('Заявка не найдена.');
		}

		const currentStatus = passRequest.status;
		if (currentStatus === status) {
			throw new BadRequestException(`Статус уже установлен как "${currentStatus}"`);
		}

		passRequest.status = status;
		passRequest.statusHistory.push({
			status: status,
			changedAt: new Date(),
		});

		await passRequest.save();

		return passRequest;
	}

	async getAll(): Promise<PassRequests[]> {
		return this._passRequestsModel.find()
			.populate({
				path: 'user',
				select: '-password -__v -createdAt -updatedAt -_id', // убираем лишнее
			})
			.exec();
	}
}
