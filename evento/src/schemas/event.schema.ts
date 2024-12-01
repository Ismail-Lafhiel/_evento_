import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Location } from './location.schema';
import { User } from './user.schema';
export type eventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, maxlength: 500 })
  description: string;

  @Prop({ required: true, trim: true })
  sportType: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  location: Location;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  participants: User[];

  @Prop({
    required: true,
    min: [1, 'Capacity is required'],
  })
  capacity: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
