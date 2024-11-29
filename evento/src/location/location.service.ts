// src/location/location.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Location, LocationDocument } from '../schemas/location.schema';
import { CreateLocationDto } from 'src/dto/create-location.dto';
import { UpdateLocationDto } from 'src/dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const createdLocation = new this.locationModel(createLocationDto);
    return createdLocation.save();
  }

  async findAll(): Promise<{ data: Location[]; count: number }> {
    try {
      const locations = await this.locationModel.find().exec();
      return {
        data: locations,
        count: locations.length,
      };
    } catch (error) {
      throw new Error('Failed to fetch locations');
    }
  }

  async findOne(id: string): Promise<Location> {
    this.validateObjectId(id);

    const location = await this.locationModel.findById(id).exec();
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    this.validateObjectId(id);

    const location = await this.locationModel
      .findByIdAndUpdate(id, { $set: updateLocationDto }, { new: true })
      .exec();

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    const result = await this.locationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid location ID');
    }
  }
}
