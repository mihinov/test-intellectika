import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './model/dto/create-user.dto';
import { UpdateUserDto } from './model/dto/update-user.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserDto } from './model/dto/user.response.dto';

@Injectable()
export class UserService {

	constructor(
		@InjectModel(User.name) private readonly _userModel: Model<UserDocument>
	) { }

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		try {
			const newUser = new this._userModel(createUserDto);

			return await newUser.save();
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const user: User | null = await this._userModel.findOne({ email });

		return user;
	}

	async getUserById(id: string): Promise<User | null> {
		return this._userModel.findById(id);
	}

	async findAll(): Promise<User[]> {
		return this._userModel.find();
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const existingUser = await this._userModel.findByIdAndUpdate(id, updateUserDto, { new: true });

		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return existingUser;
	}

	async deleteUser(id: string): Promise<User> {
		const deletedUser = await this._userModel.findByIdAndDelete(id);

		if (!deletedUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return deletedUser;
	}

	/**
	 * Создаёт сущность UserDto из User, в UserDto отсутствует поле с паролем
	 */
	createReturnedUserDto(user: User): UserDto {
		const userDto = plainToInstance(UserDto, user, { excludeExtraneousValues: true });
		return instanceToPlain(userDto) as UserDto; // Преобразование в plain object
	}

	deleteAllUsers(): Promise<any> {
		return this._userModel.deleteMany({});
	}
}
