import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDto {
	@ApiProperty({
		description: 'Access токен',
		type: String,
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzA4MmM0NTFkMWZhYzNiNzg0NGU1NTEiLCJpc1ByZW1pdW1FbmFibGVkIjpmYWxzZSwib0F1dGhWa0lkIjpudWxsLCJwaG9uZU51bWJlciI6bnVsbCwiZW1haWwiOiJwb2dvcmVsb3ZhQGJrLnJ1IiwiY3JlYXR',
	})
	access_token!: string;
}
