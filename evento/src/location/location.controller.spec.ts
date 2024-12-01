import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { HttpStatus, HttpException, NotFoundException } from '@nestjs/common';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  const mockLocation = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Location',
    address: 'Test Address',
    city: 'Test City',
    capacity: 100,
  };

  const mockLocationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a location', async () => {
      const createLocationDto: CreateLocationDto = {
        address: 'New Address',
        city: 'New City',
        country: 'country 1',
      };

      mockLocationService.create.mockResolvedValue(mockLocation);

      const result = await controller.create(createLocationDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Location created successfully',
        data: mockLocation,
      });
      expect(service.create).toHaveBeenCalledWith(createLocationDto);
    });

    it('should handle errors during creation', async () => {
      const createLocationDto: CreateLocationDto = {
        address: 'New Address',
        city: 'New City',
        country: 'country 1',
      };

      mockLocationService.create.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(controller.create(createLocationDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all locations', async () => {
      const mockLocations = {
        data: [mockLocation],
        count: 1,
      };

      mockLocationService.findAll.mockResolvedValue(mockLocations);

      const result = await controller.findAll();

      expect(result).toEqual({
        success: true,
        data: mockLocations.data,
        count: mockLocations.count,
      });
    });

    it('should handle errors when fetching locations', async () => {
      mockLocationService.findAll.mockRejectedValue(new Error('Fetch failed'));

      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a single location', async () => {
      mockLocationService.findOne.mockResolvedValue(mockLocation);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Location retrieved successfully',
        data: mockLocation,
      });
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should handle not found error', async () => {
      mockLocationService.findOne.mockRejectedValue(
        new NotFoundException('Location not found'),
      );

      await expect(
        controller.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const updateLocationDto: UpdateLocationDto = {
        address: 'Updated Address',
        city: 'Updated City',
        country: "Updated country",
      };

      const updatedLocation = { ...mockLocation, ...updateLocationDto };
      mockLocationService.update.mockResolvedValue(updatedLocation);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateLocationDto,
      );

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Location updated successfully',
        data: updatedLocation,
      });
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateLocationDto,
      );
    });

    it('should handle not found error during update', async () => {
      const updateLocationDto: UpdateLocationDto = {
        address: 'Updated Address',
      };

      mockLocationService.update.mockRejectedValue(
        new NotFoundException('Location not found'),
      );

      await expect(
        controller.update('507f1f77bcf86cd799439011', updateLocationDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a location', async () => {
      mockLocationService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('507f1f77bcf86cd799439011');

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Location deleted successfully',
      });
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should handle not found error during removal', async () => {
      mockLocationService.remove.mockRejectedValue(
        new NotFoundException('Location not found'),
      );

      await expect(
        controller.remove('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // Testing Guard behavior
  describe('Guard Protection', () => {
    it('should have Organizer decorator on protected routes', () => {
      const createHandler = Reflect.getMetadata(
        'organizer',
        LocationController.prototype.create,
      );
      const updateHandler = Reflect.getMetadata(
        'organizer',
        LocationController.prototype.update,
      );
      const deleteHandler = Reflect.getMetadata(
        'organizer',
        LocationController.prototype.remove,
      );

      expect(createHandler).toBeDefined();
      expect(updateHandler).toBeDefined();
      expect(deleteHandler).toBeDefined();
    });

    it('should have OrganizerGuard on protected routes', () => {
      const createGuards = Reflect.getMetadata(
        '__guards__',
        LocationController.prototype.create,
      );
      const updateGuards = Reflect.getMetadata(
        '__guards__',
        LocationController.prototype.update,
      );
      const deleteGuards = Reflect.getMetadata(
        '__guards__',
        LocationController.prototype.remove,
      );

      expect(createGuards).toBeDefined();
      expect(updateGuards).toBeDefined();
      expect(deleteGuards).toBeDefined();
    });
  });

  // Testing Response Format
  describe('Response Format', () => {
    it('should return correct success response format', async () => {
      mockLocationService.create.mockResolvedValue(mockLocation);

      const result = await controller.create({
        address: 'Test Address',
        city: 'Test City',
        country: "Test country",
      });

      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
    });

    it('should return correct error response format', async () => {
      mockLocationService.findAll.mockRejectedValue(new Error('Test error'));

      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });
});
