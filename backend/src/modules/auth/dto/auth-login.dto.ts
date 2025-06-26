import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";
import { ApiProperty } from "@nestjs/swagger";
import * as Joi from 'joi';

@JoiSchemaOptions({})
export class AuthLoginEmailPasswordDto {
	@ApiProperty({
		description: 'email пользователя',
		required: true,
		type: String,
		example: 'user@gmail.com',
	})
	@JoiSchema(Joi.string().email().required())
	email!: string;

	@ApiProperty({
		description: 'Пароль пользователя',
		required: true,
		type: String,
		example: 'password',
	})
	@JoiSchema(Joi.string().required())
	password!: string;
}
