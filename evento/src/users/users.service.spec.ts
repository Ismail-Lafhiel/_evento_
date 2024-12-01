import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    role: 'participant',
    save: jest.fn(),
  };

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should return null if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('findByUsernameOrEmail', () => {
    it('should find a user by username', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByUsernameOrEmail('testuser', '');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ username: 'testuser' }, { email: '' }],
      });
    });

    it('should find a user by email', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByUsernameOrEmail(
        '',
        'test@example.com',
      );

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ username: '' }, { email: 'test@example.com' }],
      });
    });

    it('should handle errors and return null', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const result = await service.findByUsernameOrEmail(
        'testuser',
        'test@example.com',
      );

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user if not exists', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        role: 'participant',
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const savedUser = { ...userData, _id: '507f1f77bcf86cd799439012' };
      mockUserModel.create.mockResolvedValue(savedUser);

      const result = await service.create(userData);

      expect(result).toEqual(savedUser);
    });

    it('should return existing user if found', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.create(userData);

      expect(result).toEqual(mockUser);
    });

    it('should handle duplicate key error', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const error = new Error('Duplicate key') as any;
      error.code = 11000;

      mockUserModel.create.mockRejectedValue(error);

      // Mock the second findOne call after the error
      mockUserModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.create(userData);

      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = {
        username: 'updateduser',
      };

      const updatedUser = { ...mockUser, ...updateData };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateData,
      );

      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true },
      );
    });

    it('should handle update errors', async () => {
      const updateData = {
        username: 'updateduser',
      };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Update failed')),
      });

      await expect(
        service.update('507f1f77bcf86cd799439011', updateData),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('findAllParticipants', () => {
    it('should return all participants', async () => {
      const mockParticipants = [mockUser];
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockParticipants),
      });

      const result = await service.findAllParticipants();

      expect(result).toEqual({
        participants: mockParticipants,
        count: 1,
      });
      expect(mockUserModel.find).toHaveBeenCalledWith({ role: 'participant' });
    });

    it('should handle errors when finding participants', async () => {
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Find failed')),
      });

      await expect(service.findAllParticipants()).rejects.toThrow(
        'Find failed',
      );
    });
  });
});
