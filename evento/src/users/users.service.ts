import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: any, authUserId: string): Promise<User> {
    const newUser = new this.userModel({
      _id: authUserId,
      ...userData,
    });
    return newUser.save();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
