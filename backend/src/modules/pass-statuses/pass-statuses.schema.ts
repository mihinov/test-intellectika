import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { PlainMongoObject } from "src/shared/utils/lean-document";

@Schema({ timestamps: true,collection: 'pass-statuses' })
export class PassStatus {
  @Prop({ required: true, unique: true })
  type: string;

  @Prop({ required: true })
  value: string;
}

export type PassStatusDocument = HydratedDocument<PassStatus>;
export type PlainPassRequests = PlainMongoObject<PassStatus>;
export const PassStatusSchema = SchemaFactory.createForClass(PassStatus);

