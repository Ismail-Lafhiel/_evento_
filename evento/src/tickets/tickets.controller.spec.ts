import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import CreateTicketDto from '../dto/create-tcket-dto';
import { Ticket } from '../schemas/ticket.schema';
import mongoose from 'mongoose';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const mockEventId = new mongoose.Types.ObjectId();
  const mockUserId = new mongoose.Types.ObjectId();

  const mockTicket: Partial<Ticket> = {
    event: mockEventId as any,
    user: mockUserId as any,
    status: 'PENDING',
    ticketNumber: 'TIX-1234567890-001',
    isCheckedIn: false,
    checkedInAt: undefined,
    cancellationReason: undefined,
    cancelledAt: undefined,
  };

  const mockTicketsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      const createTicketDto: CreateTicketDto = {
        event: mockEventId.toString(),
        user: mockUserId.toString(),
      };

      mockTicketsService.create.mockResolvedValue(mockTicket);

      const result = await controller.create(createTicketDto);
      expect(result).toEqual(mockTicket);
      expect(mockTicketsService.create).toHaveBeenCalledWith(createTicketDto);
    });
  });

  describe('findAll', () => {
    it('should return all tickets', async () => {
      const mockResponse = {
        data: [mockTicket],
        count: 1,
      };
      mockTicketsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();
      expect(result).toEqual(mockResponse);
      expect(mockTicketsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single ticket', async () => {
      const ticketId = new mongoose.Types.ObjectId().toString();
      mockTicketsService.findOne.mockResolvedValue(mockTicket);

      const result = await controller.findOne(ticketId);
      expect(result).toEqual(mockTicket);
      expect(mockTicketsService.findOne).toHaveBeenCalledWith(ticketId);
    });
  });

  describe('error handling', () => {
    it('should handle invalid ticket status', async () => {
      const createTicketDto: CreateTicketDto = {
        event: mockEventId.toString(),
        user: mockUserId.toString(),
      };

      mockTicketsService.create.mockRejectedValue(
        new Error('Invalid ticket status'),
      );

      await expect(controller.create(createTicketDto)).rejects.toThrow(
        'Invalid ticket status',
      );
    });
  });
});
