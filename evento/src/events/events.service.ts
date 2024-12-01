import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Event, eventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<eventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventModel.create(createEventDto);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Event[]; count: number; totalPages: number }> {
    try {
      //search query
      const searchQuery = search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { sportType: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const skip = (page - 1) * limit;

      const totalCount = await this.eventModel.countDocuments(searchQuery);

      const events = await this.eventModel
        .find(searchQuery)
        .populate('location')
        .populate('participants')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        data: events,
        count: totalCount,
        totalPages: Math.ceil(totalCount / limit),
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
    const event = await this.eventModel.findById(eventId);

    // if event is full
    if (event.participants.length >= event.capacity) {
      throw new BadRequestException('Event has reached maximum capacity');
    }

    //if user is already participating
    if (
      event.participants.some(
        (participant) => participant._id.toString() === userId,
      )
    ) {
      throw new BadRequestException(
        'User is already participating in this event',
      );
    }

    event.participants.push(userId as any);
    return event.save();
  }

  async removeParticipant(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (
      !event.participants.some(
        (participant) => participant._id.toString() === userId,
      )
    ) {
      throw new BadRequestException('User is not participating in this event');
    }

    event.participants = event.participants.filter(
      (participant) => participant._id.toString() !== userId,
    );

    return event.save();
  }

  async getAvailableSpots(eventId: string): Promise<number> {
    const event = await this.findOne(eventId);
    return event.capacity - event.participants.length;
  }

  async isEventFull(eventId: string): Promise<boolean> {
    const event = await this.findOne(eventId);
    return event.participants.length >= event.capacity;
  }

  async isUserParticipating(eventId: string, userId: string): Promise<boolean> {
    const event = await this.findOne(eventId);
    return event.participants.some(
      (participant) => participant._id.toString() === userId,
    );
  }
}
