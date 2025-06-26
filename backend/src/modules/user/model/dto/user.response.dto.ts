import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserDto {
	@Expose()
	@ApiProperty({
		description: 'Email пользователя',
		type: String,
		example: 'user@gmail.com'
	})
	email!: string;

	@Expose()
	@ApiProperty({
		description: 'Телефон пользователя',
		type: String,
		example: '8 906 333 33 33'
	})
	phone!: string;

	@Expose()
	@ApiProperty({
		description: 'Организация пользователя',
		type: String,
		example: 'Intellectika'
	})
	organization!: string;

	@Expose()
	@ApiProperty({
		description: 'Роль пользователя',
		type: String,
		example: 'user'
	})
	role!: string;
}
