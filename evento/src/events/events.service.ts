import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Event, eventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';

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
    const events = await this.eventModel
      .find()
      .populate('location')
      .populate('participants')
      .exec();

    return {
      data: events,
      count: events.length,
    };
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
}
