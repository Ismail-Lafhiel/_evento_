import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id?: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ default: 'participant', enum: ['participant', 'organizer'] })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  eventsOrganized: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  registeredEvents: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
