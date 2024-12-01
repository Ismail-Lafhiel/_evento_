import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import CreateTicketDto from '../dto/create-tcket-dto';
import { UpdateTicketDto } from '../dto/update-ticket-dto';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketModel.create(createTicketDto);
  }

  async findAll(): Promise<{ data: Ticket[]; count: number }> {
    try {
      const tickets = await this.ticketModel.find().exec();
      return {
        data: tickets,
        count: tickets.length,
      };
    } catch (error) {
      throw new Error('Failed to fetch tickets');
    }
  }

  async findOne(id: string): Promise<Ticket> {
    this.validateObjectId(id);

    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException(`ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    this.validateObjectId(id);

    const ticket = await this.ticketModel
      .findByIdAndUpdate(id, { $set: updateTicketDto }, { new: true })
      .exec();

    if (!ticket) {
      throw new NotFoundException(`ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    const result = await this.ticketModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`ticket with ID ${id} not found`);
    }
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid ticket ID');
    }
  }
}
