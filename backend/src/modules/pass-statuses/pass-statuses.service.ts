import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassStatus, PassStatusDocument } from './pass-statuses.schema';
import { Model } from 'mongoose';
import { CreatePassStatusDto } from './model/dto/create-status.dto';
import { IPassStatus } from './model/interfaces';

@Injectable()
export class PassStatusesService {
	static DEFAULT_STATUSES = [
		{ type: 'InProgress', value: 'в обработке' },
		{ type: 'UnderReview', value: 'на согласовании' },
		{ type: 'Ready', value: 'пропуск готов' },
		{ type: 'Rejected', value: 'отклонён' },
		{ type: 'Issued', value: 'пропуск выдан' },
	];

	constructor(
		@InjectModel(PassStatus.name) private readonly _passStatusModel: Model<PassStatusDocument>
	) {}

	async create(createStatusDto: CreatePassStatusDto): Promise<PassStatusDocument> {
		return this._passStatusModel.create({
			type: createStatusDto.type,
			value: createStatusDto.value,
		});
	}

	async createInitStatuses(): Promise<PassStatusDocument[]> {
		return this._passStatusModel.insertMany(PassStatusesService.DEFAULT_STATUSES);
	}

	async getAll(): Promise<PassStatusDocument[]> {
		return this._passStatusModel.find().exec();
	}

	async getStatusByType(type: string): Promise<PassStatusDocument | null> {
		return this._passStatusModel.findOne({ type: type }).exec();
	}

	async getAllByTypeAndValue(passStatuses: IPassStatus[]): Promise<PassStatusDocument[]> {
		if (!passStatuses.length) {
			return [];
		}

		return this._passStatusModel.find({ $or: passStatuses }).exec();
	}
}
