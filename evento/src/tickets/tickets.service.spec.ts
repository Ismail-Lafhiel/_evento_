import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
import { NotFoundException } from '@nestjs/common';

describe('TicketsService', () => {
  let service: TicketsService;
  let model: Model<TicketDocument>;

  const mockTicket = {
    _id: new Types.ObjectId(),
    event: new Types.ObjectId(),
    user: new Types.ObjectId(),
    status: 'PENDING',
    ticketNumber: 'TIX-1234567890-001',
    isCheckedIn: false,
    save: jest.fn(),
  };

  const mockTicketModel = {
    create: jest.fn().mockResolvedValue(mockTicket),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getModelToken(Ticket.name),
          useValue: mockTicketModel,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    model = module.get<Model<TicketDocument>>(getModelToken(Ticket.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ticket', async () => {
      const createTicketDto = {
        event: 'eventId123',
        user: 'userId123',
      };

      mockTicketModel.create.mockResolvedValue(mockTicket);

      const result = await service.create(createTicketDto);
      expect(result).toEqual(mockTicket);
      expect(mockTicketModel.create).toHaveBeenCalledWith(createTicketDto);
    });
  });

  describe('findAll', () => {
    it('should return all tickets with count', async () => {
      const mockTickets = [mockTicket];
      mockTicketModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTickets),
      });

      const result = await service.findAll();
      expect(result).toEqual({
        data: mockTickets,
        count: 1,
      });
    });

    it('should handle errors when fetching tickets', async () => {
      mockTicketModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(new Error('Database error')),
      });

      await expect(service.findAll()).rejects.toThrow(
        'Failed to fetch tickets',
      );
    });
  });

  describe('findOne', () => {
    it('should return a ticket by id', async () => {
      const ticketId = mockTicket._id.toString();
      mockTicketModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTicket),
      });

      const result = await service.findOne(ticketId);
      expect(result).toEqual(mockTicket);
    });

    it('should throw NotFoundException if ticket not found', async () => {
      const ticketId = mockTicket._id.toString();
      mockTicketModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.findOne(ticketId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a ticket', async () => {
      const ticketId = mockTicket._id.toString();
      mockTicketModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTicket),
      });

      await service.remove(ticketId);
      expect(mockTicketModel.findByIdAndDelete).toHaveBeenCalledWith(ticketId);
    });
  });
});
