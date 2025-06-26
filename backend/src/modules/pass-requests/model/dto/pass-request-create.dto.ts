import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";
import { ApiProperty } from "@nestjs/swagger";
import * as Joi from 'joi';

@JoiSchemaOptions({})
export class PassRequestCreateDto {
	@ApiProperty({
		description: 'Цель визита',
		required: true,
		type: String,
		example: 'Покакать в библиотеке',
	})
	@JoiSchema(Joi.string().required())
	visitPurpose!: string;
}
