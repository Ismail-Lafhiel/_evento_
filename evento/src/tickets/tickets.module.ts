import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';
import { Ticket, TicketSchema } from 'src/schemas/ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    EventsModule,
    UsersModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
