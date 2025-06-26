import { Request } from 'express';
import { User } from 'src/modules/user/user.schema';

export class RequestUserDto extends Request {
	user!: User;
}
