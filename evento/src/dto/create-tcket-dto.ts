import { IsMongoId, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TicketStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export default class CreateTicketDto {
  @ApiProperty({
    description: 'The ID of the event',
    example: '65a123b456c789d012345e67'
  })
  @IsNotEmpty({ message: 'Event ID is required' })
  @IsMongoId({ message: 'Invalid event ID format' })
  event: string;

  @ApiProperty({
    description: 'The ID of the user (must have FAN role)',
    example: '65a123b456c789d012345e67'
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsMongoId({ message: 'Invalid user ID format' })
  user: string;
}