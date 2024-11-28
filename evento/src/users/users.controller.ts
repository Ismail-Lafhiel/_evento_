import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  ConflictException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Organizer } from 'src/decorators/organizer.decorator';
import { OrganizerGuard } from 'src/guards/organizer.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    try {
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
      console.log('Login attempt for user:', loginDto.username);

      // 1. Login with auth service
      const authResponse = await axios.post(
        `${authServiceUrl}/auth/login`,
        loginDto,
      );

      const { access_token, user: authUser } = authResponse.data.data;

      // 2. Find or create user in evento database
      try {
        let eventoUser = await this.usersService.findByUsernameOrEmail(
          authUser.username,
          authUser.email,
        );

        if (!eventoUser) {
          eventoUser = await this.usersService.create({
            fullname: authUser.fullname,
            email: authUser.email,
            username: authUser.username,
            role: 'participant',
            eventsOrganized: [],
            registeredEvents: [],
          });
        } else {
          // Update existing user data if needed
          eventoUser = await this.usersService.update(eventoUser._id, {
            fullname: authUser.fullname,
          });
        }

        return {
          statusCode: HttpStatus.OK,
          message: 'Login successful',
          data: {
            access_token,
            user: eventoUser,
          },
        };
      } catch (dbError) {
        console.error('Database error during login:', dbError);
        throw new HttpException(
          'Error processing user data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          error.response?.data?.message || 'Login failed',
          error.response?.status || HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  async register(
    @Body()
    registerDto: {
      fullname: string;
      email: string;
      username: string;
      password: string;
    },
  ) {
    try {
      // Check if user already exists in evento database
      const existingUser = await this.usersService.findByUsernameOrEmail(
        registerDto.username,
        registerDto.email,
      );

      if (existingUser) {
        if (existingUser.username === registerDto.username) {
          throw new ConflictException('Username already exists');
        }
        if (existingUser.email === registerDto.email) {
          throw new ConflictException('Email already exists');
        }
      }

      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');

      // 1. Register with auth service
      const authResponse = await axios.post(
        `${authServiceUrl}/auth/register`,
        registerDto,
      );

      const authUser = authResponse.data.data;

      // 2. Create user in evento database
      try {
        const eventoUser = await this.usersService.create({
          fullname: registerDto.fullname,
          email: registerDto.email,
          username: registerDto.username,
          role: 'participant',
          eventsOrganized: [],
          registeredEvents: [],
        });

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Registration successful',
          data: {
            access_token: authResponse.data.token,
            user: eventoUser,
          },
        };
      } catch (dbError) {
        if (dbError.code === 11000) {
          // Determine which field caused the duplicate key error
          const field = Object.keys(dbError.keyPattern)[0];
          throw new ConflictException(`${field} already exists`);
        }
        console.error('Database error during registration:', dbError);
        throw new HttpException(
          'Error creating user account',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          error.response?.data?.message || 'Registration failed',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Organizer()
  @UseGuards(OrganizerGuard)
  @Get('participants')
  async getAllParticipants() {
    return await this.usersService.findAllParticipants();
  }
}
