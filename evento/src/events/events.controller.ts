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
} from '@nestjs/common';
import { EventsService } from './events.service';

import { OrganizerGuard } from '../guards/organizer.guard';
import { Organizer } from '../decorators/organizer.decorator';
import { CreateEventDto } from 'src/dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Organizer()
  @UseGuards(OrganizerGuard)
  async create(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventsService.create(createEventDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Event created successfully',
      data: event,
    };
  }

  @Get()
  async findAll() {
    const { data, count } = await this.eventsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: count > 0 ? 'Events retrieved successfully' : 'No events found',
      data: data,
      count: count,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Event retrieved successfully',
      data: event,
    };
  }

  
}
