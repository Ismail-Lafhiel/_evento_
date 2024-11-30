import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Event, eventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<eventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll(): Promise<{ data: Event[]; count: number }> {
    try {
      const events = await this.eventModel
        .find()
        .populate('location')
        .populate('participants')
        .exec();

      return {
        data: events,
        count: events.length,
      };
    } catch (error) {
      throw new Error('Failed to fetch events');
    }
  }

  async findOne(id: string): Promise<Event> {
    this.validateObjectId(id);

    const event = await this.eventModel
      .findById(id)
      .populate('location')
      .populate('participants')
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    this.validateObjectId(id);

    const event = await this.eventModel
      .findByIdAndUpdate(id, { $set: updateEventDto }, { new: true })
      .populate('location')
      .populate('participants')
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid ID format');
    }
  }

  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  // handling participants

  async getEventWithParticipants(eventId: string): Promise<{
    eventId: string;
    eventName: string;
    description: string;
    sportType: string;
    date: Date;
    participants: User[];
    participantCount: number;
  }> {
    this.validateObjectId(eventId);

    const event = await this.eventModel
      .findById(eventId)
      .populate('participants')
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return {
      eventId: event._id.toString(),
      eventName: event.name,
      description: event.description,
      sportType: event.sportType,
      date: event.date,
      participants: event.participants,
      participantCount: event.participants.length,
    };
  }

  async addParticipant(eventId: string, userId: string): Promise<Event> {
    this.validateObjectId(eventId);
    this.validateObjectId(userId);

    const event = await this.eventModel
      .findByIdAndUpdate(
        eventId,
        { $addToSet: { participants: userId } },
        { new: true },
      )
      .populate('location')
      .populate('participants')
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }

  async removeParticipant(eventId: string, userId: string): Promise<Event> {
    this.validateObjectId(eventId);
    this.validateObjectId(userId);

    const event = await this.eventModel
      .findByIdAndUpdate(
        eventId,
        { $pull: { participants: userId } },
        { new: true },
      )
      .populate('location')
      .populate('participants')
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }
}
