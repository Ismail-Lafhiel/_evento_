import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class OrganizerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (user.role !== 'organizer') {
      throw new UnauthorizedException('Access denied. Organizers only.');
    }

    return true;
  }
}
