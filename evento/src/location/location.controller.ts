// src/location/location.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  HttpStatus
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from 'src/dto/create-location.dto';
import { OrganizerGuard } from '../guards/organizer.guard';
import { Organizer } from 'src/decorators/organizer.decorator';

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
      data: location
    };
  }

  @Get()
  async findAll() {
    const { data, count } = await this.locationService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: count > 0 ? 'Locations retrieved successfully' : 'No locations found',
      data: data,
      count: count
    };
  }
}
