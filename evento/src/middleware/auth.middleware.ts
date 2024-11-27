import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NextFunction } from 'express';
import { RequestWithUser } from 'src/interfaces/request.interface';
import { UsersService } from 'src/users/users.service';

// src/middleware/auth.middleware.ts
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const publicPaths = ['/users/login', '/users/register'];

    if (publicPaths.some((path) => req.url.includes(path))) {
      return next();
    }

    try {
      const authHeader = req.header('Authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');

      try {
        const response = await axios.get(`${authServiceUrl}/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data;

        // Try to find user by username or email
        let eventoUser = await this.usersService.findByUsernameOrEmail(
          userData.username,
          userData.email,
        );

        if (!eventoUser) {
          try {
            eventoUser = await this.usersService.create({
              fullname: userData.fullname,
              email: userData.email,
              username: userData.username,
              role: 'participant',
              eventsOrganized: [],
              registeredEvents: [],
            });
          } catch (error) {
            // Check one more time in case of race condition
            eventoUser = await this.usersService.findByUsernameOrEmail(
              userData.username,
              userData.email,
            );

            if (!eventoUser) {
              throw error;
            }
          }
        } else {
          // Update existing user if needed
          eventoUser = await this.usersService.update(eventoUser._id, {
            fullname: userData.fullname,
          });
        }

        req.user = eventoUser;
        next();
      } catch (error) {
        console.error(
          'Token validation error:',
          error.response?.data || error.message,
        );
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      next(error);
    }
  }
}
