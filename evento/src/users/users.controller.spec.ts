import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let configService: ConfigService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    fullname: 'Test User',
    role: 'participant',
    eventsOrganized: [],
    registeredEvents: [],
  };

  const mockUsersService = {
    findByUsernameOrEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAllParticipants: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123',
    };

    const mockAuthResponse = {
      data: {
        data: {
          access_token: 'mock_token',
          user: {
            username: 'testuser',
            email: 'test@example.com',
            fullname: 'Test User',
          },
        },
      },
    };

    beforeEach(() => {
      mockConfigService.get.mockReturnValue('http://localhost:3000');
    });

    it('should successfully login existing user', async () => {
      (axios.post as jest.Mock).mockResolvedValue(mockAuthResponse);
      mockUsersService.findByUsernameOrEmail.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: {
          access_token: 'mock_token',
          user: mockUser,
        },
      });
    });

    it('should create new user if not exists during login', async () => {
      (axios.post as jest.Mock).mockResolvedValue(mockAuthResponse);
      mockUsersService.findByUsernameOrEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: {
          access_token: 'mock_token',
          user: mockUser,
        },
      });
    });

    it('should handle auth service error', async () => {
      const error = {
        response: {
          data: { message: 'Invalid credentials' },
          status: HttpStatus.UNAUTHORIZED,
        },
        isAxiosError: true,
      };
      (axios.post as jest.Mock).mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(HttpException);
    });
  });

  describe('register', () => {
    const registerDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      fullname: 'New User',
    };

    const mockAuthResponse = {
      data: {
        data: {
          user: {
            username: 'newuser',
            email: 'new@example.com',
            fullname: 'New User',
          },
        },
      },
    };

    beforeEach(() => {
      mockConfigService.get.mockReturnValue('http://localhost:3000');
    });

    it('should successfully register new user', async () => {
      mockUsersService.findByUsernameOrEmail.mockResolvedValue(null);
      (axios.post as jest.Mock).mockResolvedValue(mockAuthResponse);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Registration successful',
        data: {
          user: mockUser,
        },
      });
    });

    it('should throw ConflictException if username exists', async () => {
      mockUsersService.findByUsernameOrEmail.mockResolvedValue({
        ...mockUser,
        username: registerDto.username,
      });

      await expect(controller.register(registerDto)).rejects.toThrow(
        new ConflictException('Username already exists'),
      );
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByUsernameOrEmail.mockResolvedValue({
        ...mockUser,
        email: registerDto.email,
      });

      await expect(controller.register(registerDto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );
    });
  });

  describe('getAllParticipants', () => {
    it('should return all participants', async () => {
      const mockParticipants = [mockUser];
      mockUsersService.findAllParticipants.mockResolvedValue({
        participants: mockParticipants,
        count: 1,
      });

      const result = await controller.getAllParticipants();

      expect(result).toEqual({
        success: true,
        data: {
          participants: mockParticipants,
          count: 1,
        },
      });
    });
  });
});
