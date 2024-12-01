import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.path.startsWith('/auth')) {
        return next();
      }

      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');

      // Validate token with auth service
      const response = await axios.get(`${authServiceUrl}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data.data;

      // Check if user exists in evento database
      let eventoUser = await this.usersService.findById(userData.id);

      if (!eventoUser) {
        eventoUser = await this.usersService.create(
          {
            fullname: userData.fullname,
            email: userData.email,
            username: userData.username,
          },
          userData.id,
        );
      }

      req['user'] = eventoUser;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
