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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';

import { OrganizerGuard } from '../guards/organizer.guard';
import { Organizer } from '../decorators/organizer.decorator';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

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
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll(page, limit, search);
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

  @Post(':eventId/participants/:userId')
  async addParticipant(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.eventsService.addParticipant(eventId, userId);
  }

  @Delete(':eventId/:userId')
  async removeParticipant(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.eventsService.removeParticipant(eventId, userId);
  }

  @Get(':eventId/available-spots')
  async getAvailableSpots(@Param('eventId') eventId: string) {
    return this.eventsService.getAvailableSpots(eventId);
  }
}
