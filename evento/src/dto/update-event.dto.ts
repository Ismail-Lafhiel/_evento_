import {
  IsString,
  IsOptional,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  sportType?: string;

  @IsDate()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  date?: Date;

  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  location?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  capacity: number;
}
