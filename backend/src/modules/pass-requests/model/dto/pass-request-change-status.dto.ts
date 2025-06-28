import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";
import { ApiProperty } from "@nestjs/swagger";
import * as Joi from 'joi';
import { PassRequestStatusEnum } from "../enum/pass-request-status.enum";

@JoiSchemaOptions({})
export class PassRequestChangeStatusDto {
	@ApiProperty({
		description: 'Статус заявки',
		required: true,
		type: String,
		example: PassRequestStatusEnum.Issued,
	})
	@JoiSchema(Joi.string().valid(...Object.values(PassRequestStatusEnum)).required())
	status!: PassRequestStatusEnum;
}
