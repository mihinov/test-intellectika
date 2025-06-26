import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";
import { ApiProperty } from "@nestjs/swagger";
import * as Joi from 'joi';
import { JoiPhoneValidator } from "src/shared/validators/phone.validator";

@JoiSchemaOptions({})
export class AuthRegisterEmailPasswordDto {
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

	@ApiProperty({
		description: 'Телефон',
		required: true,
		type: String,
		example: '8 906 333 33 33',
	})
	@JoiSchema(JoiPhoneValidator.required())
	phone!: string;

	@ApiProperty({
		description: 'Организация',
		required: true,
		type: String,
		example: 'Intellectika',
	})
	@JoiSchema(Joi.string().required())
	organization!: string;
}
