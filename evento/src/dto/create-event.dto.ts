import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  sportType: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsMongoId()
  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}
