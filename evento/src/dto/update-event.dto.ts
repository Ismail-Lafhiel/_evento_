import { IsString, IsOptional, IsDate, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  sportType?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsMongoId()
  @IsOptional()
  location?: string;
}
