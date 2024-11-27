// src/location/location.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/location.schema';
import { CreateLocationDto } from 'src/dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    console.log('Creating location with data:', createLocationDto);
    const createdLocation = new this.locationModel(createLocationDto);
    const savedLocation = await createdLocation.save();
    console.log('Location created successfully:', savedLocation);
    return savedLocation;
  }

  async findAll(): Promise<{ data: Location[]; count: number }> {
    try {
      const locations = await this.locationModel.find().exec();
      console.log('Found locations:', locations);
      return {
        data: locations,
        count: locations.length
      };
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }
}
