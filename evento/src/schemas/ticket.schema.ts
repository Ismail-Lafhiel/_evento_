// src/schemas/ticket.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { Event } from './event.schema';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  })
  event: Event;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function (userId: mongoose.Types.ObjectId) {
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        return user?.role === 'FAN';
      },
      message: 'Only users with FAN role can have tickets',
    },
  })
  user: User;

  @Prop({
    required: true,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({
    required: true,
    unique: true,
    default: () => generateTicketNumber(),
  })
  ticketNumber: string;

  @Prop({
    default: false,
  })
  isCheckedIn: boolean;

  @Prop()
  checkedInAt?: Date;

  @Prop({
    type: String,
    required: false,
  })
  cancellationReason?: string;

  @Prop({
    type: Date,
    required: false,
  })
  cancelledAt?: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

function generateTicketNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `TIX-${timestamp}-${random}`;
}
