import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../schemas/event.schema';

describe('EventsService', () => {
  let service: EventsService;

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

  // Create mock model
  const mockEventModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    countDocuments: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      const mockEvents = [mockEvent];
      mockEventModel.exec.mockResolvedValueOnce(mockEvents);
      mockEventModel.countDocuments.mockResolvedValueOnce(1);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockEvents,
        count: 1,
        totalPages: 1,
      });
    });

    it('should handle search query', async () => {
      const mockEvents = [mockEvent];
      mockEventModel.exec.mockResolvedValueOnce(mockEvents);
      mockEventModel.countDocuments.mockResolvedValueOnce(1);

      const result = await service.findAll(1, 10, 'Football');

      expect(mockEventModel.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'Football', $options: 'i' } },
          { sportType: { $regex: 'Football', $options: 'i' } },
        ],
      });
      expect(result.data).toEqual(mockEvents);
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      mockEventModel.exec.mockResolvedValueOnce(mockEvent);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockEvent);
      expect(mockEventModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException when event not found', async () => {
      mockEventModel.exec.mockResolvedValueOnce(null);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        'Event with ID 507f1f77bcf86cd799439011 not found',
      );
    });
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = {
        name: 'New Event',
        description: 'New Description',
        sportType: 'Football',
        date: new Date(),
        location: '507f1f77bcf86cd799439012',
        capacity: 20,
      };

      mockEventModel.create.mockResolvedValueOnce({
        ...createEventDto,
        _id: '507f1f77bcf86cd799439011',
        save: jest.fn().mockResolvedValue(mockEvent),
      });

      const result = await service.create(createEventDto);

      expect(result).toHaveProperty('_id');
      expect(result.name).toBe(createEventDto.name);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateEventDto = {
        name: 'Updated Event',
      };
      const updatedEvent = { ...mockEvent, ...updateEventDto };
      mockEventModel.exec.mockResolvedValueOnce(updatedEvent);

      const result = await service.update('507f1f77bcf86cd799439011', {
        name: 'Updated Event',
        description: 'Updated Description',
        sportType: 'Football',
        date: new Date(),
        location: '507f1f77bcf86cd799439012',
        capacity: 25,
      });

      expect(result.name).toBe(updateEventDto.name);
    });

    it('should throw NotFoundException when event not found', async () => {
      mockEventModel.exec.mockResolvedValueOnce(null);

      await expect(
        service.update('507f1f77bcf86cd799439011', {
          name: 'Updated Event',
          description: 'Updated Description',
          sportType: 'Football',
          date: new Date(),
          location: '507f1f77bcf86cd799439012',
          capacity: 25,
        }),
      ).rejects.toThrow('Event with ID 507f1f77bcf86cd799439011 not found');
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      mockEventModel.exec.mockResolvedValueOnce(mockEvent);

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockEventModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException when event not found', async () => {
      mockEventModel.exec.mockResolvedValueOnce(null);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        'Event with ID 507f1f77bcf86cd799439011 not found',
      );
    });
  });
});
