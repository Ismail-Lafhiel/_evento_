import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Ticket } from 'src/schemas/ticket.schema';
import CreateTicketDto from 'src/dto/create-tcket-dto';
import { UpdateTicketDto } from 'src/dto/update-ticket-dto';
import { Organizer } from 'src/decorators/organizer.decorator';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Organizer()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The ticket has been successfully created.',
    type: Ticket,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ticket data provided.',
  })
  async create(@Body() createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @Organizer()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all tickets',
    type: [Ticket],
  })
  async findAll(): Promise<{ data: Ticket[]; count: number }> {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by id' })
  @ApiParam({
    name: 'id',
    description: 'The ticket ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The ticket has been found.',
    type: Ticket,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found.',
  })
  async findOne(@Param('id') id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Organizer()
  @Put(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiParam({
    name: 'id',
    description: 'The ticket ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The ticket has been successfully updated.',
    type: Ticket,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiParam({
    name: 'id',
    description: 'The ticket ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The ticket has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ticketsService.remove(id);
  }
}
