import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";
import { ApiProperty } from "@nestjs/swagger";
import * as Joi from 'joi';
import { PassRequestStatus } from "../enum/pass-request-status.enum";

@JoiSchemaOptions({})
export class PassRequestChangeStatusDto {
	@ApiProperty({
		description: 'Статус заявки',
		required: true,
		type: String,
		example: PassRequestStatus.Issued,
	})
	@JoiSchema(Joi.string().valid(...Object.values(PassRequestStatus)).required())
	status!: PassRequestStatus;
}
