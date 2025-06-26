import { ApiProperty } from "@nestjs/swagger";

export class AuthErrorDto {
	@ApiProperty({
		description: 'Сообщение об ошибке',
		type: String,
		required: true,
		example: 'Невалидный токен',
	})
	message!: string

	@ApiProperty({
		description: 'Тип ошибки',
		type: String,
		example: 'Unauthorized',
	})
	error!: string

	@ApiProperty({
		description: 'Код ошибки',
		type: Number,
		example: 401,
	})
	statusCode!: number

	@ApiProperty({
		description: 'Дата и Время возникновения ошибки',
		type: Date,
		example: new Date(),
	})
	timestamp!: Date

	@ApiProperty({
		description: 'Url запроса',
		type: String,
		example: 'http://localhost:4000/api/auth/me',
	})
	path!: string
}

export class AuthValidationErrorDto {
	@ApiProperty({
		description: 'Сообщение об ошибке',
		type: String,
		required: true,
		example: 'Пользователь c данным email не существует',
	})
	message!: string

	@ApiProperty({
		description: 'Тип ошибки',
		type: String,
		example: 'Unauthorized',
	})
	error!: string

	@ApiProperty({
		description: 'Код ошибки',
		type: Number,
		example: 401,
	})
	statusCode!: number

	@ApiProperty({
		description: 'Дата и Время возникновения ошибки',
		type: Date,
		example: new Date(),
	})
	timestamp!: Date

	@ApiProperty({
		description: 'Url запроса',
		type: String,
		example: 'http://localhost:4000/api/auth/login',
	})
	path!: string
}

export class AuthRegistrationErrorDto {
	@ApiProperty({
		description: 'Сообщение об ошибке',
		type: String,
		required: true,
		example: 'Пользователь email: pogorelova@bk.ru уже зарегистрирован',
	})
	message!: string

	@ApiProperty({
		description: 'Тип ошибки',
		type: String,
		example: 'Unauthorized',
	})
	error!: string

	@ApiProperty({
		description: 'Код ошибки',
		type: Number,
		example: 401,
	})
	statusCode!: number

	@ApiProperty({
		description: 'Дата и Время возникновения ошибки',
		type: Date,
		example: new Date(),
	})
	timestamp!: Date

	@ApiProperty({
		description: 'Url запроса',
		type: String,
		example: 'http://localhost:4000/api/auth/registration-email-password',
	})
	path!: string
}
