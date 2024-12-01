import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/location.schema';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { NotFoundException } from '@nestjs/common';

describe('LocationService', () => {
  let service: LocationService;
  let model: Model<LocationDocument>;

  const mockLocation = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Location',
    address: 'Test Address',
    city: 'Test City',
    capacity: 100,
    save: jest.fn(),
  };

  const mockLocationModel = {
    new: jest.fn().mockResolvedValue(mockLocation),
    constructor: jest.fn().mockResolvedValue(mockLocation),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken(Location.name),
          useValue: mockLocationModel,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    model = module.get<Model<LocationDocument>>(getModelToken(Location.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a location', async () => {
      const createLocationDto: CreateLocationDto = {
        address: 'New Address',
        city: 'New City',
        country: 'country 1',
      };

      mockLocationModel.create.mockResolvedValue({
        ...createLocationDto,
        _id: '507f1f77bcf86cd799439011',
        save: jest
          .fn()
          .mockResolvedValue({
            ...createLocationDto,
            _id: '507f1f77bcf86cd799439011',
          }),
      });

      const result = await service.create(createLocationDto);

      expect(result).toHaveProperty('_id');
      expect(result.address).toBe(createLocationDto.address);
      expect(mockLocationModel.create).toHaveBeenCalledWith(createLocationDto);
    });
  });

  describe('findAll', () => {
    it('should return all locations', async () => {
      const mockLocations = [mockLocation];
      mockLocationModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLocations),
      });

      const result = await service.findAll();

      expect(result).toEqual({
        data: mockLocations,
        count: mockLocations.length,
      });
      expect(mockLocationModel.find).toHaveBeenCalled();
    });

    it('should handle errors when fetching locations', async () => {
      mockLocationModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.findAll()).rejects.toThrow(
        'Failed to fetch locations',
      );
    });
  });

  describe('findOne', () => {
    it('should find one location', async () => {
      mockLocationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLocation),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockLocation);
      expect(mockLocationModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException if location not found', async () => {
      mockLocationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for invalid ObjectId', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const updateLocationDto: UpdateLocationDto = {
        address: 'Updated Address',
      };

      const updatedLocation = { ...mockLocation, ...updateLocationDto };
      mockLocationModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedLocation),
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateLocationDto,
      );

      expect(result.address).toBe(updateLocationDto.address);
      expect(mockLocationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { $set: updateLocationDto },
        { new: true },
      );
    });

    it('should throw NotFoundException if location not found during update', async () => {
      mockLocationModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('507f1f77bcf86cd799439011', {
          address: 'Updated adress',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid ObjectId during update', async () => {
      await expect(
        service.update('invalid-id', { address: 'Updated adress' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a location', async () => {
      mockLocationModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLocation),
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockLocationModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException if location not found during removal', async () => {
      mockLocationModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for invalid ObjectId during removal', async () => {
      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateObjectId', () => {
    it('should throw NotFoundException for invalid ObjectId', () => {
      expect(() => {
        service['validateObjectId']('invalid-id');
      }).toThrow(NotFoundException);
    });

    it('should not throw for valid ObjectId', () => {
      expect(() => {
        service['validateObjectId']('507f1f77bcf86cd799439011');
      }).not.toThrow();
    });
  });
});
