// src/location/location.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { OrganizerGuard } from '../guards/organizer.guard';
import { Organizer } from '../decorators/organizer.decorator';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @Organizer()
  @UseGuards(OrganizerGuard)
  async create(@Body() createLocationDto: CreateLocationDto) {
    const location = await this.locationService.create(createLocationDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Location created successfully',
      data: location,
    };
  }

  @Get()
  async findAll() {
    try {
      const locations = await this.locationService.findAll();
      return {
        success: true,
        data: locations.data,
        count: locations.count,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch locations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const location = await this.locationService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Location retrieved successfully',
      data: location,
    };
  }

  @Put(':id')
  @Organizer()
  @UseGuards(OrganizerGuard)
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const location = await this.locationService.update(id, updateLocationDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Location updated successfully',
      data: location,
    };
  }

  @Delete(':id')
  @Organizer()
  @UseGuards(OrganizerGuard)
  async remove(@Param('id') id: string) {
    await this.locationService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Location deleted successfully',
    };
  }
}
