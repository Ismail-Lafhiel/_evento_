import { Controller, Body, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/')
  async getUsers(){
    return 'hello users'
  }
}
