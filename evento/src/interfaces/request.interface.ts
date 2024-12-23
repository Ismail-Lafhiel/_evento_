// src/location/interfaces/request.interface.ts
import { Request } from 'express';
import { User } from 'src/schemas/user.schema';

export interface RequestWithUser extends Request {
  user: User;
}
