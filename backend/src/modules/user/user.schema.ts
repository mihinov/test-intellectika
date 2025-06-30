import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { PlainMongoObject } from "src/shared/utils/lean-document";
import { UserRole } from "./model/enum/user-role.enum";

@Schema({ timestamps: true, collection: 'users' })
export class User {

	@Prop({ type: String, required: true, unique: true })
	email!: string;

	@Prop({ type: String, required: true })
  password!: string;

	@Prop({ type: String, required: true})
	phone: string;

	@Prop({ type: String, required: true})
	organization: string;

	@Prop({ type: String, enum: UserRole, required: true, default: UserRole.User })
	role: string;
}

export type UserDocument = HydratedDocument<User>;
export type PlainUser = PlainMongoObject<User>;
export const UserSchema = SchemaFactory.createForClass(User);
