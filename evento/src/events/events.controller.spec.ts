import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { HttpStatus } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;

  const mockEvent = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Event',
    description: 'Test Description',
    sportType: 'Football',
    date: new Date(),
    location: '507f1f77bcf86cd799439012',
    capacity: 20,
    participants: [],
  };

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getEventWithParticipants: jest.fn(),
    addParticipant: jest.fn(),
    removeParticipant: jest.fn(),
    getAvailableSpots: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an event', async () => {
      mockEventsService.create.mockResolvedValue(mockEvent);

      const result = await controller.create({
        name: 'Test Event',
        description: 'Test Description',
        sportType: 'Football',
        date: new Date(),
        location: '507f1f77bcf86cd799439012',
        capacity: 20,
      });

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Event created successfully',
        data: mockEvent,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      const paginatedEvents = {
        data: [mockEvent],
        count: 1,
        totalPages: 1,
      };
      mockEventsService.findAll.mockResolvedValue(paginatedEvents);

      const result = await controller.findAll(1, 10, 'search');

      expect(result).toEqual(paginatedEvents);
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      mockEventsService.findOne.mockResolvedValue(mockEvent);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Event retrieved successfully',
        data: mockEvent,
      });
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updatedEvent = { ...mockEvent, name: 'Updated Event' };
      mockEventsService.update.mockResolvedValue(updatedEvent);

      const result = await controller.update('507f1f77bcf86cd799439011', {
        name: 'Updated Event',
        description: 'Updated Description',
        sportType: 'Football',
        date: new Date(),
        location: '507f1f77bcf86cd799439012',
        capacity: 25,
      });

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Event updated successfully',
        data: updatedEvent,
      });
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      mockEventsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('507f1f77bcf86cd799439011');

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Event deleted successfully',
      });
    });
  });
});
