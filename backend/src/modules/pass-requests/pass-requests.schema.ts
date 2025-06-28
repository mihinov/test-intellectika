import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { PlainMongoObject } from "src/shared/utils/lean-document";
import { User } from "../user/user.schema";
import { PassStatus } from "../pass-statuses/pass-statuses.schema";

@Schema({ timestamps: true, collection: 'pass-requests' })
export class PassRequests {

	@Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

	@Prop({ required: true })
  visitPurpose: string;

  @Prop({ type: Types.ObjectId, ref: PassStatus.name, required: true })
  status: Types.ObjectId;

  @Prop({
    type: [{
      status: { type: Types.ObjectId, ref: PassStatus.name, required: true },
      changedAt: { type: Date, required: true },
    }],
    default: [],
  })
  statusHistory: { status: Types.ObjectId; changedAt: Date }[];
}

export type PassRequestsDocument = HydratedDocument<PassRequests>;
export type PlainPassRequests = PlainMongoObject<PassRequests>;
export const PassRequestsSchema = SchemaFactory.createForClass(PassRequests);
