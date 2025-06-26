import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { PlainMongoObject } from "src/shared/utils/lean-document";
import { User } from "../user/user.schema";
import { PassRequestStatus } from "./model/enum/pass-request-status.enum";
import { PassRequestStatusHistory } from "./model/interfaces/pass-request-status-history.interface";

@Schema({ timestamps: true, collection: 'pass-requests' })
export class PassRequests {

	@Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

	@Prop({ required: true })
  visitPurpose: string;

	@Prop({ enum: PassRequestStatus, default: PassRequestStatus.InProgress })
  status: PassRequestStatus;

	@Prop({
    type: [
      {
        status: { type: String, enum: PassRequestStatus },
        changedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  statusHistory: PassRequestStatusHistory[]
}

export type PassRequestsDocument = HydratedDocument<PassRequests>;
export type PlainPassRequests = PlainMongoObject<PassRequests>;
export const PassRequestsSchema = SchemaFactory.createForClass(PassRequests);
