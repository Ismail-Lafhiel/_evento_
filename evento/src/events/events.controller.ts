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
import { UpdateEventDto } from 'src/dto/update-event.dto';

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

  @Put(':id')
  @Organizer()
  @UseGuards(OrganizerGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const event = await this.eventsService.update(id, updateEventDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Event updated successfully',
      data: event,
    };
  }

  @Delete(':id')
  @Organizer()
  @UseGuards(OrganizerGuard)
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Event deleted successfully',
    };
  }

  @Get(':id/participants')
  async getEventWithParticipants(@Param('id') id: string) {
    return this.eventsService.getEventWithParticipants(id);
  }

  @Post(':id/participants/:userId')
  async addParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const event = await this.eventsService.addParticipant(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Participant added successfully',
      data: event,
    };
  }

  @Delete(':id/participants/:userId')
  async removeParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const event = await this.eventsService.removeParticipant(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Participant removed successfully',
      data: event,
    };
  }
}
