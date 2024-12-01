import { IsEnum, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus } from './create-tcket-dto';

export class UpdateTicketDto {
  @ApiPropertyOptional({
    enum: TicketStatus,
    description: 'The status of the ticket',
    example: 'CONFIRMED'
  })
  @IsOptional()
  @IsEnum(TicketStatus, {
    message: 'Status must be either PENDING, CONFIRMED, or CANCELLED'
  })
  status?: TicketStatus;

  @ApiPropertyOptional({
    description: 'Reason for cancellation (required if status is CANCELLED)',
    example: 'Unable to attend the event'
  })
  @IsOptional()
  @IsString({ message: 'Cancellation reason must be a string' })
  cancellationReason?: string;

  @ApiPropertyOptional({
    description: 'Whether the ticket has been checked in',
    example: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isCheckedIn must be a boolean value' })
  isCheckedIn?: boolean;
}