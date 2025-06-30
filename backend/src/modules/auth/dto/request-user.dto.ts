import { Request } from 'express';
import { UserDocument } from 'src/modules/user/user.schema';

export class RequestUserDto extends Request {
	user!: UserDocument;
}
