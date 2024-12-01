// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    try {
      return await this.userModel
        .findOne({
          $or: [{ username: username }, { email: email }],
        })
        .exec();
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      // Check if user exists first
      const existingUser = await this.findByUsernameOrEmail(
        userData.username,
        userData.email,
      );

      if (existingUser) {
        // If user exists, return the existing user
        return existingUser;
      }

      // If user doesn't exist, create new user
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error by returning existing user
        const existingUser = await this.findByUsernameOrEmail(
          userData.username,
          userData.email,
        );
        if (existingUser) {
          return existingUser;
        }
      }
      throw error;
    }
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    try {
      return await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async findAllParticipants(): Promise<{
    participants: User[];
    count: number;
  }> {
    try {
      const participants = await this.userModel
        .find({ role: 'participant' })
        .exec();
      return {
        participants,
        count: participants.length,
      };
    } catch (error) {
      console.error('Error finding participants:', error);
      throw error;
    }
  }
}
