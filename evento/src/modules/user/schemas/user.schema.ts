import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AppUserDocument = AppUser & Document;

@Schema()
export class AppUser {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: 'participant', enum: ['participant', 'organizer', 'admin'] })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  eventsOrganized: string[]; // IDs of events created by the user (for organizers)

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  registeredEvents: string[]; // IDs of events the user registered for
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);
