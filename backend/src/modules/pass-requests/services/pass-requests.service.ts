import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddField } from 'src/shared/utils/add-field';
import { PassStatusesService } from 'src/modules/pass-statuses/pass-statuses.service';
import { PassStatusDocument } from 'src/modules/pass-statuses/pass-statuses.schema';
import { RequestUserDto } from 'src/modules/auth/dto/request-user.dto';
import { User } from 'src/modules/user/user.schema';
import { PassRequestChangeStatusDto } from '../model/dto/pass-request-change-status.dto';
import { PassRequestCreateDto } from '../model/dto/pass-request-create.dto';
import { PassRequestStatusEnum } from '../model/enum/pass-request-status.enum';
import { PassRequests, PassRequestsDocument } from '../pass-requests.schema';

@Injectable()
export class PassRequestsService {
  constructor(
    @InjectModel(PassRequests.name) private readonly _passRequestsModel: Model<PassRequestsDocument>,
		private readonly _passStatusesService: PassStatusesService
  ) {}

  async getByUserId(userId: string): Promise<PassRequests | null> {
    return this._passRequestsModel
      .findOne({ user: userId })
      .populate({
        path: 'user',
        select: '-password -__v -createdAt -updatedAt -_id',
      })
			.populate({
				path: 'status',
				select: '-__v -createdAt -updatedAt',
			})
			.populate({
				path: 'statusHistory.status',
				select: '-__v -createdAt -updatedAt',
			})
			.exec();
  }

	async create(
		passRequestCreateDto: PassRequestCreateDto,
		req: RequestUserDto
	): Promise<PassRequests> {
		try {
			const user = req.user;

			// Проверяем, есть ли уже заявка от этого пользователя
			const existingRequest = await this._passRequestsModel.findOne({ user: user._id });
			if (existingRequest) {
				throw new ConflictException('Вы уже подали заявку. Нельзя создать повторно.');
			}

			// Получаем статус из коллекции PassStatus по enum-значению
			const initialStatusDoc = await this._passStatusesService.getStatusByType(PassRequestStatusEnum.InProgress);
			if (!initialStatusDoc) {
				throw new NotFoundException('Статус "В процессе" не найден в базе.');
			}

			// Создаем заявку с полями
			const newPassRequest = new this._passRequestsModel({
				visitPurpose: passRequestCreateDto.visitPurpose,
				user: user._id,
				status: initialStatusDoc._id,
				statusHistory: [
					{
						status: initialStatusDoc._id,
						changedAt: new Date(),
					},
				],
			});

			return await newPassRequest.save();
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async changeStatus(
		passRequestId: string,
		{ status }: PassRequestChangeStatusDto,
		req: RequestUserDto
	) {
		const user = req.user;

		if (user.role !== 'admin') {
			throw new ForbiddenException('Нет прав на изменение статуса');
		}

		const passRequest = await this._passRequestsModel
			.findById(passRequestId)
			.populate<{ status: PassStatusDocument }>('status'); // правильная типизация после populate

		if (!passRequest) {
			throw new ConflictException('Заявка не найдена.');
		}

		const validStatuses = Object.values(PassRequestStatusEnum);
		if (!validStatuses.includes(status)) {
			throw new BadRequestException(
				`Недопустимый статус: "${status}". Разрешённые значения: ${validStatuses.join(', ')}`
			);
		}

		if (passRequest.status.type === String(status)) {
			throw new BadRequestException(`Статус уже установлен как "${status}"`);
		}

		const newStatusDoc = await this._passStatusesService.getStatusByType(status);
		if (!newStatusDoc) {
			throw new ConflictException(`Статус с типом "${status}" не найден в базе.`);
		}

		passRequest.status = newStatusDoc;
		passRequest.statusHistory.push({
			status: newStatusDoc._id,
			changedAt: new Date(),
		});

		await passRequest.save();

		return passRequest;
	}

	async getAll(): Promise<PassRequests[]> {
		return this._passRequestsModel
			.find()
			.populate({
				path: 'user',
				select: '-password -__v -createdAt -updatedAt -_id',
			})
			.populate({
				path: 'status',
				select: '-__v -createdAt -updatedAt',
			})
			.populate({
				path: 'statusHistory.status',
				select: '-__v -createdAt -updatedAt',
			})
			.exec();
	}
}
